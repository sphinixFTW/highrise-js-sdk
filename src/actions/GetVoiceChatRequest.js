const { HighriseApiError } = require("../handlers/errors");
const { SendPayloadAndGetResponse, CheckVoiceChatRequest } = require("../models/models");

class VoiceChat {
  constructor(bot) {
    this.bot = bot;
    this.reqId = Math.floor(Math.random() * 1000);
  }

  async fetch() {
    try {
      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        const checkVoiceChatRequest = new CheckVoiceChatRequest(this.reqId.toString());
        const payload = {
          _type: 'CheckVoiceChatRequest',
          rid: checkVoiceChatRequest.rid
        };

        const sender = new SendPayloadAndGetResponse(this.bot);
        const response = await sender.sendPayloadAndGetResponse(
          payload,
          CheckVoiceChatRequest.Response
        );

        const { seconds_left, auto_speakers, users } = response.seconds_left;
        return { seconds_left, auto_speakers, users };
      }
    } catch (error) {
      const highriseError = new HighriseApiError("Error fetching users voice chat:", error);
      this.bot.emit('error', highriseError);
    }
  }

  get = {
    seconds: async () => {
      const { seconds_left } = await this.fetch();
      return seconds_left;
    },
    auto_speakers: async () => {
      const { auto_speakers } = await this.fetch();
      return auto_speakers;
    },
    active: async () => {
      const { users } = await this.fetch();
      return Object.entries(users)
        .filter(([userId, status]) => status === 'voice')
        .map(([userId]) => userId);
    },
    muted: async () => {
      const { users } = await this.fetch();
      return Object.entries(users)
        .filter(([userId, status]) => status === 'muted')
        .map(([userId]) => userId);
    },
  };


}

module.exports = { VoiceChat };