const { CheckVoiceChatRequest } = require("../utils/models");
const { HighriseApiError } = require("../handlers/errors");

class VoiceChat {
  constructor(bot) {
    this.bot = bot;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      const request = new CheckVoiceChatRequest();

      const payload = {
        _type: 'CheckVoiceChatRequest',
        rid: request.rid,
      };

      const responseHandler = (response) => {
        if (
          response &&
          response._type === 'CheckVoiceChatResponse'
        ) {
          const { seconds_left, auto_speakers, users } = response;
          resolve({ seconds_left, auto_speakers, users });
        } else {
          reject(new HighriseApiError('Invalid response received.'));
        }
      };

      this.bot.ws.on('message', (message) => {
        const response = JSON.parse(message);
        if (response._type === 'CheckVoiceChatResponse') {
          responseHandler(response);
        }
      });

      // Send the payload
      this.bot.ws.send(JSON.stringify(payload));
    });
  }
}

module.exports = { VoiceChat };
