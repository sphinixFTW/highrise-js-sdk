const { HighriseApiError, InvalidConversationIdError } = require("../handlers/errors");
const { GetConversationsRequest, GetMessagesRequest, LeaveConversationRequest, SendPayloadAndGetResponse } = require("../models/models");

class DirectMessages {
  constructor(bot) {
    this.bot = bot;
    this.reqId = Math.floor(Math.random() * 1000);
  }

  get = {
    conversations: async (not_joined = false, last_id = null) => {
      try {
        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const getDmRequest = new GetConversationsRequest(not_joined, last_id);
          const payload = {
            _type: "GetConversationsRequest",
            rid: getDmRequest.rid,
            not_joined: getDmRequest.not_joined,
            last_id: getDmRequest.last_id
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            GetConversationsRequest.Response
          );

          return response.conversations.conversations;
        } else {
          console.error("Error: WebSocket is not open: readyState 2".red);
          return null;
        }
      } catch (error) {
        console.log(error);
        const highriseError = new HighriseApiError("Error fetching room users:", error);
        this.bot.emit('error', highriseError);
        return null;
      }
    },

    messages: async (conversation_id, last_message_id = null) => {
      try {
        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const getMessagesRequest = new GetMessagesRequest(conversation_id);
          const payload = {
            _type: "GetMessagesRequest",
            rid: getMessagesRequest.rid,
            conversation_id: conversation_id,
            last_message_id: last_message_id
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse

          const response = await sender.sendPayloadAndGetResponse(
            payload,
            GetMessagesRequest.Response
          );

          return response.messages.messages;
        } else {
          console.error("Error: WebSocket is not open: readyState 2".red);
          return null;
        }
      } catch (error) {
        const highriseError = new HighriseApiError("Error fetching messages:", error);
        this.bot.emit('error', highriseError);
        return null;
      }
    }
  }

  async leave(conversation_id) {
    try {

      if (!conversation_id || typeof conversation_id !== 'string') {
        throw new InvalidConversationIdError('Invalid conversation ID. Please provide a valid value for the conversation ID.'.red);
      }

      const leaveConversationRequest = new LeaveConversationRequest(conversation_id);

      const payload = {
        _type: 'LeaveConversationRequest',
        conversation_id: leaveConversationRequest.conversation_id,
        rid: leaveConversationRequest.rid
      };

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            console.error('Error sending leave Conversation Request:'.red, error);
            throw new HighriseApiError("Error sending leaveConversationRequest:".red);
          }
        });
      }

    } catch (error) {
      const highriseError = new HighriseApiError("Error fetching messages:", error);
      this.bot.emit('error', highriseError);
    }
  }
}

module.exports = { DirectMessages };
