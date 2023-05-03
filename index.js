const WebSocket = require('ws')
const EventEmitter = require('events');
const handleMessageEvent = require('./src/handlers/event');
const { Message } = require('./src/actions/MessagesRequest');
const { RoomUsers } = require('./src/actions/GetRoomUsersRequest');
const { Walk } = require('./src/actions/FloorHitRequest');
const { Wallet } = require('./src/actions/GetWalletRequest');
const { Mods } = require('./src/actions/RoomPrivilegeRequest');
const { Indicator } = require('./src/actions/IndicatorRequest');
const { Ping } = require('./src/actions/pingRequest');
const { Users } = require('./src/actions/UsersRequest');
const { InvalidUserIdError, InvalidMessageType, HighriseApiError } = require("./src/handlers/errors")
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

        this.ws.setMaxListeners(50); // Set maximum number of listeners to 15
        this.ws.addEventListener('open', this.handleOpen.bind(this));
        this.ws.addEventListener('message', this.handleMessage.bind(this));
        this.ws.addEventListener('close', this.handleClose.bind(this));
        this.ws.addEventListener('error', this.handleError.bind(this));
        //this.message = new Message(this)
        this.room = {
            players: new RoomUsers(this)
        };
        this.walk = new Walk(this)
        this.player = new Users(this)
        this.indicator = new Indicator(this)
        this.wallet = new Wallet(this);
        this.privilege = new Mods(this);
        this.ping = new Ping(this)

    }

    sendKeepalive() {
        this.ws.send(JSON.stringify({ _type: 'KeepaliveRequest' }));
        /*console.log(this.ws.listenerCount('message'));
        const events = this.ws.eventNames();
        for (const event of events) {
            console.log(`Number of listeners for "${event}": ${this.ws.listenerCount(event)}`);
        }*/
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
            this.reconnectTimeoutDuration *= 1; // Double the duration
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
        console.log(`Connected Using Highrise Javascript SDK at (${today})`.green);
        this.sendKeepalive();
        clearTimeout(this.reconnectTimeout);
    }

    handleClose(event) {
        if (event.code === 1000 && event.reason === '') {
            const today = new Date().toLocaleString("en-us");
            console.error(`Connection closed with code ${event.code} at (${today})`.red);
            this.reconnect();
        } else {
            this.reconnect();
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
