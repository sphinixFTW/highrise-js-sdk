const { HighriseApiError } = require("../handlers/errors");
const { SendPayloadAndGetResponse, CheckVoiceChatRequest } = require("../models/models");

class VoiceChat {
  constructor(bot) {
    this.bot = bot;
    this.reqId = Math.floor(Math.random() * 1000);
  }

  async fetch() {

    try {
      const sendPayloadAndGetResponse = new SendPayloadAndGetResponse(this.bot);
      const checkVoiceChatRequest = new CheckVoiceChatRequest(this.reqId.toString());

      const payload = {
        _type: 'CheckVoiceChatRequest',
        rid: checkVoiceChatRequest.rid
      };

      const response = await sendPayloadAndGetResponse.sendPayloadAndGetResponse(
        payload,
        CheckVoiceChatRequest.Response
      );

      return response.content;
    } catch (error) {
      const highriseError = new HighriseApiError("Error fetching users voice chat:", error);
      this.bot.emit('error', highriseError);
    }

  }
}

module.exports = { VoiceChat };