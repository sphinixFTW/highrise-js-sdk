const { HighriseApiError } = require("../handlers/errors");
const { GetWalletRequest, SendPayloadAndGetResponse } = require("../models/models");

class Wallet {
  constructor(bot) {
    this.bot = bot;
    this.reqId = Math.floor(Math.random() * 1000);
  }

  async fetch() {
    try {

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        const getWalletRequest = new GetWalletRequest(this.reqId.toString());
        const payload = {
          _type: "GetWalletRequest",
          rid: getWalletRequest.rid
        };

        const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
        const response = await sender.sendPayloadAndGetResponse(
          payload,
          GetWalletRequest.Response
        );

        this.walletData = response.content.content[0]; // Store the wallet data

        return this.walletData;

      }
    } catch (error) {
      const highriseError = new HighriseApiError("Error fetching wallet request:", error);
      this.bot.emit('error', highriseError);
    }
  }

  get = {
    amount: async () => {
      try {
        if (!this.walletData) {
          await this.fetch();
        }
        const amount = this.walletData.amount;
        return amount;

      } catch (error) {
        console.error(error);
      }
    },

    type: async () => {
      try {
        if (!this.walletData) {
          await this.fetch();
        }
        const type = this.walletData.type;
        return type;

      } catch (error) {
        console.error(error);
      }
    }
  }

}

module.exports = { Wallet };