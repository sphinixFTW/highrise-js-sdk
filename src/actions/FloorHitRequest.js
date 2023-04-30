const { InvalidCoordinates, HighriseApiError } = require("../handlers/errors");
const { FloorHitRequest, Position } = require("../utils/models");

class Walk {
    constructor(bot) {
        this.bot = bot;
    }

    send(x, y, z, facing = 'FrontLeft') {
        try {

            if (!x || !y || !z) {
                throw new InvalidCoordinates('Invalid coordinates. Please provide valid values for x, y, and z.'.red)
            }

            if (typeof facing !== 'string') {
                throw new Error('Invalid facing parameter. Must be a string.'.red);
            }

            const dest = new Position(x, y, z, facing);
            const floorHitRequest = new FloorHitRequest(dest);

            const payload = {
                _type: 'FloorHitRequest',
                destination: floorHitRequest.destination,
                rid: floorHitRequest.rid
            };

            this.bot.ws.send(JSON.stringify(payload), (error) => {
                if (error) {
                    console.error('Error sending floor request:'.red, error);
                    throw new HighriseApiError("Error sending FloorHitRequest:".red);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = { Walk };
