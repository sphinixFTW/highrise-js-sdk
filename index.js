const WebSocket = require('ws')
const EventEmitter = require('events');
const handleMessageEvent = require('./src/handlers/event');
const { RoomUsers } = require('./src/actions/GetRoomUsersRequest');
const { Move } = require('./src/actions/FloorHitRequest');
const { Wallet } = require('./src/actions/GetWalletRequest');
const { Mods } = require('./src/actions/RoomPrivilegeRequest');
const { Indicator } = require('./src/actions/IndicatorRequest');
const { VoiceChat } = require('./src/actions/GetVoiceChatRequest');
const { Ping } = require('./src/actions/pingRequest');
const { Users } = require('./src/actions/UsersRequest');
const { AwaitEvents } = require("./src/actions/awaitEvents");
const { InvalidUserIdError, InvalidMessageType } = require("./src/handlers/errors")
const { ChatRequest } = require("./src/utils/models")
require('colors')

class Highrise extends EventEmitter {
    constructor(token, roomId) {
        super();
        this.token = token;
        this.roomId = roomId;
        this.reconnectTimeoutDuration = 5;
        if (!this.token || this.token === "") {
            console.error("[Aborted] Please supply a bot token in your configuration file.".red);
            return
        }
        if (!this.roomId || this.roomId === "") {
            console.error("[Aborted] Please supply a room id in your configuration file.".red);
            return
        }

        this.ws = new WebSocket('wss://highrise.game/web/webapi', {
            headers: {
                'room-id': this.roomId,
                'api-token': this.token,
            },
        });

        this.ws.setMaxListeners(16);
        this.ws.addEventListener('open', this.handleOpen.bind(this));
        this.ws.addEventListener('message', this.handleMessage.bind(this));
        this.ws.addEventListener('close', this.handleClose.bind(this));
        this.ws.addEventListener('error', this.handleError.bind(this));
        this.room = {
            players: new RoomUsers(this),
            voice: new VoiceChat(this)
        };
        this.move = new Move(this);
        this.player = new Users(this);
        this.indicator = new Indicator(this);
        this.wallet = new Wallet(this);
        this.privilege = new Mods(this);
        this.ping = new Ping(this);
        this.chat = new AwaitEvents(this);
    }

    sendKeepalive() {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ _type: 'KeepaliveRequest', rid: null }));
        }
        setTimeout(() => this.sendKeepalive(), 15000);
    }

    reconnect() {
        console.log(`Attempting to reconnect in ${this.reconnectTimeoutDuration} seconds...`.green);

        // Close the old WebSocket instance
        if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
            this.ws.removeEventListener('open', this.handleOpen);
            this.ws.removeEventListener('message', this.handleMessage);
            this.ws.removeEventListener('close', this.handleClose);
            this.ws.removeEventListener('error', this.handleError);
            this.ws.close();
        }

        clearTimeout(this.reconnectTimeout); // Clear the previous timeout, if any

        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeoutDuration *= 2; // Double the duration (set to 1 rn)
            this.ws = new WebSocket('wss://highrise.game/web/webapi', {
                headers: {
                    'room-id': this.roomId,
                    'api-token': this.token,
                },
            });

            this.ws.addEventListener('open', this.handleOpen.bind(this));
            this.ws.addEventListener('message', this.handleMessage.bind(this));
            this.ws.addEventListener('close', this.handleClose.bind(this));
            this.ws.addEventListener('error', this.handleError.bind(this));
        }, this.reconnectTimeoutDuration * 1000); // Multiply by 1000 to convert seconds to milliseconds
    }

    handleOpen() {
        const today = new Date().toLocaleString("en-us");
        const packageJson = require('./package.json');
        const version = packageJson.version;

        console.log(`Connected Using Highrise Javascript SDK (v${version}) at (${today})`.green);
        this.sendKeepalive();
        clearTimeout(this.reconnectTimeout);
    }

    handleClose(event) {
        const today = new Date().toLocaleString("en-us");

        switch (event.code) {
            case 1000:
                console.log(`Connection closed with code ${event.code} at (${today}) - Normal closure`.green);
                this.reconnect();
                break;
            case 1001:
                console.log(`Connection closed with code ${event.code} at (${today}) - Going Away`.green);
                this.reconnect();
                break;
            case 1006:
                console.log(`Connection closed with code ${event.code} at (${today}) - Abnormal closure (no close frame received)`.red);
                this.reconnect();
                break;
            case 1005:
                console.log(`Connection closed with code ${event.code} at (${today}) - No status received`.yellow);
                this.reconnect();
                break;
            case 1008:
                console.log(`Connection closed with code ${event.code} at (${today}) - Policy Violation`.red);
                this.reconnect();
                break;
            case 1011:
                console.log(`Connection closed with code ${event.code} at (${today}) - Unexpected condition prevented the request from being fulfilled`.red);
                this.reconnect();
                break;
            default:
                console.error(`Connection closed with unexpected code ${event.code} at (${today})`.red);
                this.reconnect();
                break;
        }
    }

    handleError(event) {
        console.error('Connection error:', event);
        this.reconnect();
    }

    handleMessage(event) {
        handleMessageEvent.call(this, event);
    }

    sendMessage(message) {
        try {
            if (!message) {
                throw new InvalidMessageType(`You can't send an empty message`.red);
            }

            let payload;
            if (message.whisper) {
                const chatRequest = new ChatRequest(message.message, message.receiver);
                payload = {
                    _type: 'ChatRequest',
                    message: chatRequest.message,
                    whisper_target_id: chatRequest.whisper_target_id,
                    rid: chatRequest.rid
                };
            } else {
                const chatRequest = new ChatRequest(message.message);
                payload = {
                    _type: 'ChatRequest',
                    message: chatRequest.message,
                    rid: chatRequest.rid
                };
            }

            if (this.ws.readyState !== WebSocket.OPEN) {
                console.error('WebSocket is not open. Message cannot be sent.');
                this.reconnect();
                return;
            }

            this.ws.send(JSON.stringify(payload));

        } catch (error) {
            console.error(error)
        }
    }

    message = {
        send: (message) => {
            try {
                if (!message) {
                    throw new InvalidMessageType(`You can't send an empty message`.red);
                }
                this.sendMessage({
                    message: message
                });
            } catch (error) {
                console.error(error)
            }
        }
    }

    whisper = {
        send: (userId, message) => {
            try {
                if (!userId) {
                    throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
                }
                if (!message) {
                    throw new InvalidMessageType(`You can't send an empty message`.red);
                }
                this.sendMessage({
                    message: message,
                    receiver: userId,
                    whisper: true
                });
            } catch (error) {
                console.error(error)
            }

        }
    };
}

module.exports = { Highrise }
