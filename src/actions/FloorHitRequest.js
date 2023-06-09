const { InvalidFacingError, InvalidCoordinatesError, HighriseApiError } = require("../handlers/errors");
const { FloorHitRequest, Position, AnchorHitRequest, AnchorPosition } = require("../models/models");

class Move {
  constructor(bot) {
    this.bot = bot;
  }

  walk(x, y, z, facing = 'FrontLeft') {
    try {

      const validFacing = ['BackLeft', 'BackRight', 'FrontLeft', 'FrontRight'];

      if (x === undefined || x === null || y === undefined || y === null || z === undefined || z === null) {
        throw new InvalidCoordinatesError('Invalid coordinates. Please provide valid values for x, y, and z.'.red)
      }

      if (typeof facing !== 'string') {
        throw new InvalidFacingError('Invalid facing parameter. It must be a string.'.red);
      }

      if (!validFacing.includes(facing)) {
        throw new InvalidFacingError(`Invalid facing parameter (${facing})`.red + `\n` + 'Available Facing Options:'.green + '\n' + `${validFacing.join("\n")}`);
      }

      const dest = new Position(x, y, z, facing);
      const floorHitRequest = new FloorHitRequest(dest);

      const payload = {
        _type: 'FloorHitRequest',
        destination: floorHitRequest.destination,
        rid: floorHitRequest.rid
      };

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            console.error('Error sending floor request:'.red, error);
            throw new HighriseApiError("Error sending FloorHitRequest:".red);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  sit(entity_id, anchor_ix = 0) {
    try {
      const entityIDString = String(entity_id);
      const anchorIndex = parseInt(anchor_ix, 10);

      if (!entityIDString || isNaN(anchorIndex)) {
        throw new Error('Invalid entity ID or anchor index. Please provide valid values for entity_id and anchor_ix.'.red);
      }

      const dest = new AnchorPosition(entityIDString, anchorIndex);
      const anchorHitRequest = new AnchorHitRequest(dest);

      const payload = {
        _type: 'AnchorHitRequest',
        anchor: anchorHitRequest.anchor,
        rid: anchorHitRequest.rid
      };

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            console.error('Error anchor request:'.red, error);
            throw new HighriseApiError("Error sending AnchorHitRequest:".red);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { Move };