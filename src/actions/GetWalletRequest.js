const { HighriseApiError } = require("../handlers/errors");
const { GetWalletRequest, sendWalletPayloadAndGetResponse } = require("../utils/models");
const reqId = Math.floor(Math.random() * 1000);
class Wallet {
    constructor(bot) {
        this.bot = bot;
        this.walletData = null;
    }

    async fetch() {
        try {
            const request = new GetWalletRequest(reqId.toString());
            const payload = {
                _type: 'GetWalletRequest',
                rid: request.rid,
            };
            const response = await new sendWalletPayloadAndGetResponse(this.bot).sendWalletPayloadAndGetResponse(payload);
            this.walletData = response; // Set the walletData property
            return response.content;

        } catch (error) {
            console.error(error);
            throw new HighriseApiError("Error fetching room users:".red);
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
            return new Error(error);
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
            return new Error(error);
        }
    }
}

module.exports = { Wallet };
