const { HighriseApiError } = require("../handlers/errors");
const { IndicatorRequest } = require("../utils/models");

class Indicator {
    constructor(bot) {
        this.bot = bot;
    }

    async set(indicator) {
        try {

            const request = new IndicatorRequest(indicator)
            const payload = {
                _type: 'IndicatorRequest',
                icon: request.icon,
                rid: request.rid
            }

            console.log(`sending payload:`, payload)
            this.bot.ws.send(JSON.stringify(payload), (error) => {
                if (error) {
                    console.error('Error sending indicator request:'.red, error)
                    throw new HighriseApiError("Error sending IndicatorRequest:".red)
                }
            })

        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = { Indicator }