const WebSocket = require('ws');
const EventEmitter = require('events');

const handleMessageEvent = require("./src/handlers/events");
const today = new Date().toLocaleString("en-us");
const packageJson = require('./package.json');
const version = packageJson.version;

const { eventTypeMap } = require("./src/models/utils");

// Actions:
const { RoomUsers } = require('./src/actions/GetRoomUsersRequest');
const { Wallet } = require('./src/actions/GetWalletRequest');
const { ChatRequest } = require('./src/models/models');
const { Ping } = require('./src/actions/PingRequest');
const { AwaitEvents } = require('./src/actions/awaitEvents');
const { Users } = require('./src/actions/UserRequest');
const { Move } = require('./src/actions/FloorHitRequest');
const { VoiceChat } = require('./src/actions/GetVoiceChatRequest');
const { DirectMessages } = require('./src/actions/DirectMessages');

// Errors:
const { HighriseApiError, InvalidMessageTypeError, InvalidUserIdError, InvalidConversationIdError, InvalidRoomIdError } = require('./src/handlers/errors');
require("colors");

class Highrise extends EventEmitter {
  /**
   * Creates an instance of Highrise.
   * @param {HighriseOptions} [options={}] - The options for Highrise.
   * @param {number} [reconnectDuration=5] - The reconnect duration.
   */

  static instances = [];
  static DEFAULT_EVENTS = ['ready'];

  constructor(options = {}, reconnectDuration = 5) {
    super();

    this.reconnectTimeoutDuration = reconnectDuration;
    this.eventTypesOfInterest = options.events || Highrise.DEFAULT_EVENTS; // Use the static constant

    if (this.reconnectTimeoutDuration && typeof this.reconnectTimeoutDuration !== 'number') {
      console.error(`[Warning] Reconnect duration must be in numbers.`.red);
    }

    this.eventTypesOfInterest = this.eventTypesOfInterest.filter(eventType => {
      if (eventType === 'ready' || Object.values(eventTypeMap).includes(eventType)) {
        return true;
      } else {
        console.error(`[Warning] Invalid event type '${eventType}'.`.red + ' ' + `Available event types:\n${Object.values(eventTypeMap).join('\n')}`.green);
        return false;
      }
    });

    this.ws = null;

    Highrise.instances.push(this);
    this.websocket = WebSocket;

    this.room = {
      players: new RoomUsers(this),
      voice: new VoiceChat(this)
    };
    this.wallet = new Wallet(this);
    this.ping = new Ping(this);
    this.chat = new AwaitEvents(this);
    this.player = new Users(this);
    this.move = new Move(this);
    this.inbox = new DirectMessages(this);
  };

  sendKeepalive() {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ _type: 'KeepaliveRequest', rid: null }));
    }
    setTimeout(() => this.sendKeepalive(), 15000);
  }

  reconnect(token, roomId) {
    console.log(`Attempting to reconnect in ${this.reconnectTimeoutDuration} seconds...`.yellow);

    // Close the old WebSocket instance
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.removeEventListeners();
      this.ws.close();
    }

    clearTimeout(this.reconnectTimeout); // Clear the previous timeout, if any

    this.reconnectTimeout = setTimeout(() => {
      this.login(token, roomId); // Pass the token and roomId to the login method
    }, this.reconnectTimeoutDuration * 1000); // Multiply by 1000 to convert seconds to milliseconds
  }


  login(token, roomId) {
    if ((!token || token === "") && (!this.token || this.token === "")) {
      console.error("[Aborted] Please supply a bot token in your configuration file.".red);
      return;
    }

    if ((!roomId || roomId === "") && (!this.roomId || this.roomId === "")) {
      console.error("[Aborted] Please supply a room ID in your configuration file.".red);
      return;
    }

    this.token = token || this.token;
    this.roomId = roomId || this.roomId;

    this.ws = new WebSocket('wss://highrise.game/web/webapi', {
      headers: {
        'room-id': this.roomId,
        'api-token': this.token,
      },
    });

    this.addEventListeners();
  }

  removeEventListeners() {
    if (!this.ws) return;
    this.ws.removeEventListener('open', this.handleOpen);
    this.ws.removeEventListener('message', this.handleMessage);
    this.ws.removeEventListener('close', this.handleClose);
    this.ws.removeEventListener('error', this.handleError);
  }

  addEventListeners() {
    if (!this.ws) return;

    this.ws.addEventListener('open', () => {
      console.log(`Connected Using Highrise Javascript SDK (v${version}) at (${today})`.green);
      this.sendKeepalive();
      clearTimeout(this.reconnectTimeout);
    });

    this.ws.addEventListener('message', this.handleMessage.bind(this));
    this.ws.addEventListener('close', this.close.bind(this));
    this.ws.addEventListener('error', this.handleError.bind(this));
  }

  close(event) {
    switch (event.code) {
      case 1000:
        console.log(`Connection closed with code ${event.code} at (${today}) - Normal closure`.green);
        break;
      case 1001:
        console.log(`Connection closed with code ${event.code} at (${today}) - Going Away`.green);
        break;
      case 1006:
        console.log(`Connection closed with code ${event.code} at (${today}) - Abnormal closure (no close frame received)`.red);
        break;
      case 1005:
        console.log(`Connection closed with code ${event.code} at (${today}) - No status received`.yellow);
        break;
      case 1008:
        console.log(`Connection closed with code ${event.code} at (${today}) - Policy Violation`.red);
        break;
      case 1011:
        console.log(`Connection closed with code ${event.code} at (${today}) - Unexpected condition prevented the request from being fulfilled`.red);
        break;
      default:
        console.error(`Connection closed with unexpected code ${event.code} at (${today})`.red);
        break;
    };

    this.emit('error', event);
  };

  handleError(event) {
    console.error('Connection error:', event);
    this.emit('error', event);
  }

  handleMessage(event) {
    handleMessageEvent.call(this, event, this.eventTypesOfInterest);
  }

  sendMessage(message) {
    try {

      if (!message) {
        throw new InvalidMessageTypeError(`You can't send an empty message`.red);
      }

      if (this.ws.readyState === WebSocket.OPEN) {
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
        this.ws.send(JSON.stringify(payload));
      } else {
        return console.error("WebSocket is not open. Message cannot be sent.")
      }

    } catch (error) {
      const highriseError = new HighriseApiError("Error sending message request:", error);
      this.emit('error', highriseError);
    }
  };

  sendPrivateInvite(conversation_id, room_id) {
    try {
      if (this.ws.readyState === WebSocket.OPEN) {
        const payload = {
          _type: 'SendMessageRequest',
          conversation_id: conversation_id,
          content: '',
          type: 'invite',
          room_id: room_id,
          rid: null
        };
        this.ws.send(JSON.stringify(payload));
      }
    } catch (error) {
      const highriseError = new HighriseApiError("Error sending message request:", error);
      this.emit('error', highriseError);
    }
  }

  sendPrivateMessage(conversation_id, content) {
    try {
      if (this.ws.readyState === WebSocket.OPEN) {
        const payload = {
          _type: 'SendMessageRequest',
          conversation_id: conversation_id,
          content: content,
          type: 'text',
          room_id: null,
          rid: null
        };
        this.ws.send(JSON.stringify(payload));
      }
    } catch (error) {
      const highriseError = new HighriseApiError("Error sending message request:", error);
      this.emit('error', highriseError);
    }
  }

  message = {
    send: (message) => {
      try {
        if (!message) {
          throw new InvalidMessageTypeError(`You can't send an empty message`.red);
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
          throw new InvalidMessageTypeError(`You can't send an empty message`.red);
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
  }

  invite = {
    send: (conversation_id, room_id) => {
      try {

        if (!conversation_id || typeof conversation_id !== 'string') {
          throw new InvalidConversationIdError('Invalid conversation ID. Please provide a valid value for the conversation ID.'.red);
        }

        if (!room_id || typeof room_id !== 'string') {
          throw new InvalidRoomIdError('Invalid room ID. Please provide a valid value for the room ID.'.red);
        }

        this.sendPrivateInvite(conversation_id, room_id);

      } catch (error) {
        console.error(error);
      }
    }
  }

  direct = {
    send: (conversation_id, content) => {
      try {

        if (!conversation_id || typeof conversation_id !== 'string') {
          throw new InvalidConversationIdError('Invalid conversation ID. Please provide a valid value for the conversation ID.'.red);
        }

        if (!content) {
          throw new InvalidMessageTypeError(`You can't send an empty message`.red);
        }

        this.sendPrivateMessage(conversation_id, content);

      } catch (error) {
        console.error(error);
      }
    }
  }

}

module.exports = { Highrise, eventTypeMap };
