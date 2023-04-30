const { ChatRequest } = require("../utils/models");
const { InvalidUserIdError, InvalidMessageType } = require("../handlers/errors");
class Message {
    constructor(bot) {
        this.bot = bot;
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

            this.bot.ws.send(JSON.stringify(payload));

        } catch (error) {
            console.error(error)
        }
    }


    room(message) {
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


    whisper(userId, message) {
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
}

module.exports = { Message }