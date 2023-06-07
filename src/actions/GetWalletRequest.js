const { HighriseApiError } = require("../handlers/errors");
const { GetWalletRequest, SendPayloadAndGetResponse } = require("../models/models");

class Wallet {
  constructor(bot) {
    this.bot = bot;
    this.reqId = Math.floor(Math.random() * 1000);
  }

  async fetch() {
    try {
      const sendPayloadAndGetResponse = new SendPayloadAndGetResponse(this.bot);
      const getWalletRequest = new GetWalletRequest(this.reqId.toString());
      const payload = {
        _type: "GetWalletRequest",
        rid: getWalletRequest.rid
      };
      const response = await sendPayloadAndGetResponse.sendPayloadAndGetResponse(
        payload,
        GetWalletRequest.Response
      );

      return response.content;
    } catch (error) {
      const highriseError = new HighriseApiError("Error fetching wallet request:", error);
      this.bot.emit('error', highriseError);
    }
  }

  async amount() {
    try {
      if (!this.walletData) {
        await this.fetch();
      }
      const amount = this.walletData.content[0].amount;
      return amount;

    } catch (error) {
      console.error(error);
    }
  }

  async type() {
    try {
      if (!this.walletData) {
        await this.fetch();
      }
      const type = this.walletData.content[0].type;
      return type;

    } catch (error) {
      console.error(error);
    }
  }

}

module.exports = { Wallet };