const { HighriseApiError, InvalidCurrencyAmount, InvalidPaymentMethod } = require("../handlers/errors");
const { GetWalletRequest, SendPayloadAndGetResponse, BuyVoiceTimeRequest, BuyRoomBoostRequest } = require("../models/models");

class Wallet {
  constructor(bot) {
    this.bot = bot;
    this.reqId = Math.floor(Math.random() * 1000);
  }

  buy = {
    voice: async (payment_method = 'bot_wallet_priority') => {
      try {
        const validPaymentMethods = ["bot_wallet_only", "bot_wallet_priority", "user_wallet_only"];
        if (!validPaymentMethods.includes(payment_method)) {
          throw new InvalidPaymentMethod(`Invalid payment method:`.red + "\n" + `${validPaymentMethods.join("\n")}`.green);
        }

        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const buyVoiceTimeRequest = new BuyVoiceTimeRequest(payment_method, this.reqId.toString())
          const payload = {
            _type: "BuyVoiceTimeRequest",
            rid: buyVoiceTimeRequest.rid,
            payment_method: buyVoiceTimeRequest.payment_method
          }

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            BuyVoiceTimeRequest.Response
          );

          return response.result.result;
        }
      } catch (error) {
        console.error(error);
      }
    },

    boost: async (payment_method = 'bot_wallet_priority', amount = 1) => {
      try {
        const validPaymentMethods = ["bot_wallet_only", "bot_wallet_priority", "user_wallet_only"];
        if (!validPaymentMethods.includes(payment_method)) {
          throw new InvalidPaymentMethod(`Invalid payment method:`.red + "\n" + `${validPaymentMethods.join("\n")}`.green);
        }

        if (!Number.isInteger(amount)) {
          throw new InvalidCurrencyAmount("Invalid currency amount.".red);
        }

        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const buyRoomBoostRequest = new BuyRoomBoostRequest(payment_method, amount, this.reqId.toString());
          const payload = {
            _type: "BuyRoomBoostRequest",
            rid: buyRoomBoostRequest.rid,
            payment_method: buyRoomBoostRequest.payment_method,
            amount: buyRoomBoostRequest.amount
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            BuyRoomBoostRequest.Response
          );

          return response.result.result;
        }
      } catch (error) {
        console.error(error);
      }
    }

  }

  async fetch() {
    try {
      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        const getWalletRequest = new GetWalletRequest(this.reqId.toString());
        const payload = {
          _type: "GetWalletRequest",
          rid: getWalletRequest.rid
        };

        const sender = new SendPayloadAndGetResponse(this.bot);
        const response = await sender.sendPayloadAndGetResponse(
          payload,
          GetWalletRequest.Response
        );

        this.walletData = response.content.content; // Store the wallet data

        return this.walletData;
      }
    } catch (error) {
      const highriseError = new HighriseApiError("Error fetching wallet request:", error);
      this.bot.emit('error', highriseError);
    }
  }

  get = {
    gold: {
      amount: async () => {
        try {
          if (!this.walletData) {
            await this.fetch();
          }
          const goldAmount = this.walletData.find(item => item.type === 'gold')?.amount || 0;
          return goldAmount;
        } catch (error) {
          console.error(error);
        }
      }
    },
    boost: {
      amount: async () => {
        try {
          if (!this.walletData) {
            await this.fetch();
          }
          const boostAmount = this.walletData.find(item => item.type === 'room_boost_tokens')?.amount || 0;
          return boostAmount;
        } catch (error) {
          console.error(error);
        }
      },
      type: async () => {
        try {
          if (!this.walletData) {
            await this.fetch();
          }
          const boostType = this.walletData.find(item => item.type === 'room_boost_tokens')?.type || '';
          return boostType;
        } catch (error) {
          console.error(error);
        }
      }
    },
    voice: {
      amount: async () => {
        try {
          if (!this.walletData) {
            await this.fetch();
          }
          const voiceAmount = this.walletData.find(item => item.type === 'room_voice_tokens')?.amount || 0;
          return voiceAmount;
        } catch (error) {
          console.error(error);
        }
      },
      type: async () => {
        try {
          if (!this.walletData) {
            await this.fetch();
          }
          const voiceType = this.walletData.find(item => item.type === 'room_voice_tokens')?.type || '';
          return voiceType;
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

}

module.exports = { Wallet };