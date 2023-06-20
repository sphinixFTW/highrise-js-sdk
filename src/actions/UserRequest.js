const { InvalidUserIdError, InvalidDurationError, InvalidEmoteIdError, HighriseApiError, InvalidCoordinatesError, InvalidFacingError, InvalidRoomIdError } = require("../handlers/errors");
const { InviteSpeakerRequest, RemoveSpeakerRequest, ReactionRequest, ModerateRoomRequest, EmoteRequest, MoveUserToRoomRequest, TeleportRequest, Position, SendPayloadAndGetResponse, GetUserOutfitRequest, GetRoomPrivilegeRequest, GetBackpackRequest } = require("../models/models");
const { userMap } = require("../models/utils");

class Users {
  constructor(bot) {
    this.bot = bot;
  }

  voice = {
    add: async (user_id) => {
      try {
        if (!user_id || typeof user_id !== 'string') {
          throw new InvalidUserIdError('Invalid user ID');
        }

        // Create an instance of InviteSpeakerRequest
        const inviteRequest = new InviteSpeakerRequest(user_id);

        // Create the payload using the request object
        const payload = {
          _type: 'InviteSpeakerRequest',
          ...inviteRequest
        };

        // Send the invite request
        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          this.bot.ws.send(JSON.stringify(payload), (error) => {
            if (error) {
              throw new HighriseApiError("Error sending InviteSpeakerRequest:".red);
            }
          });
        }

      } catch (error) {
        console.error(error);
      }
    },
    remove: async (user_id) => {
      try {
        if (!user_id || typeof user_id !== 'string') {
          throw new InvalidUserIdError('Invalid user ID');
        }

        // Create an instance of RemoveSpeakerRequest
        const removeRequest = new RemoveSpeakerRequest(user_id);

        // Create the payload using the request object
        const payload = {
          _type: 'RemoveSpeakerRequest',
          ...removeRequest
        };

        // Send the remove request
        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          this.bot.ws.send(JSON.stringify(payload), (error) => {
            if (error) {
              throw new HighriseApiError("Error sending RemoveSpeakerRequest:".red);
            }
          });
        }

      } catch (error) {
        console.error(error);
      }
    }
  };

  async react(targetUserId, reaction) {
    try {

      const emoteIdMap = ReactionRequest.getReactionMap();
      if (reaction && !ReactionRequest.isValidReaction(reaction)) {
        console.error(`Invalid reaction '${reaction}'`.red + `\n` + `Available Reactions:`.green + `\n` + `${Object.keys(emoteIdMap).join("\n")}`);
        return;
      }

      if (!targetUserId || typeof targetUserId !== 'string') {
        throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
      }

      const reactionRequest = new ReactionRequest(targetUserId, reaction);
      const payload = reactionRequest.toPayload();

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            throw new HighriseApiError("Error sending ReactionRequest:".red);
          }
        });
      }

    } catch (error) {
      console.error(error)
    }
  };

  async moderateRoom(request) {
    try {
      const payload = {
        _type: "ModerateRoomRequest",
        user_id: request.user_id,
        moderation_action: request.moderation_action,
        action_length: request.action_length !== undefined ? request.action_length : null,
        rid: request.rid
      };

      return new Promise((resolve, reject) => {
        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          this.bot.ws.send(JSON.stringify(payload), error => {
            if (error) {
              console.error("Error sending ModerateRoomRequest:".red, error);
              reject(error);
              throw new HighriseApiError("Error sending ModerateRoomRequest:".red)
            } else {
              resolve();
            }
          });
        } else {
          reject();
        }
      });
    } catch (error) {
      console.error(error)
    }
  };

  async kick(user_id) {
    try {
      if (!user_id || typeof user_id !== 'string') {
        throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
      }
      await this.moderateRoom(
        new ModerateRoomRequest(user_id, "kick")
      );
    } catch (error) {
      console.log(error)
    }
  };

  async ban(user_id, seconds) {
    try {
      if (!user_id || typeof user_id !== 'string') {
        throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
      }
      if (!Number.isInteger(seconds)) {
        throw new InvalidDurationError('Invalid duration. Duration must be an integer.'.red);
      }
      await this.moderateRoom(
        new ModerateRoomRequest(user_id, "ban", seconds)
      );
    } catch (error) {
      console.log(error)
    }
  };

  async mute(user_id, seconds) {
    try {
      if (!user_id || typeof user_id !== 'string') {
        throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
      }
      if (!Number.isInteger(seconds)) {
        throw new InvalidDurationError('Invalid duration. Duration must be an integer.'.red);
      }
      await this.moderateRoom(
        new ModerateRoomRequest(user_id, "mute", seconds)
      );
    } catch (error) {
      console.log(error)
    }
  };

  async unmute(user_id) {
    try {
      if (!user_id || typeof user_id !== 'string') {
        throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
      }
      await this.moderateRoom(
        new ModerateRoomRequest(user_id, "mute", 1)
      );
    } catch (error) {
      console.log(error)
    }
  };

  async unban(user_id) {
    try {
      if (!user_id || typeof user_id !== 'string') {
        throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
      }
      await this.moderateRoom(
        new ModerateRoomRequest(user_id, "unban", null)
      );
    } catch (error) {
      console.log(error)
    }
  };

  sendEmote(targetUserId, emoteId) {
    try {
      const emoteRequest = new EmoteRequest(targetUserId, emoteId);

      const payload = {
        _type: 'EmoteRequest',
        emote_id: emoteRequest.emote_id,
        target_user_id: emoteRequest.target_user_id,
        rid: emoteRequest.rid
      };

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            console.error("Error sending EmoteRequest:".red, error);
            throw new HighriseApiError("Error sending EmoteRequest:".red)
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  async emote(targetUserId, emoteId) {
    try {
      if (!emoteId || typeof emoteId !== 'string') {
        throw new InvalidEmoteIdError('Invalid emote ID. Please provide a valid string for emote ID.');
      }

      if (!targetUserId || typeof targetUserId !== 'string') {
        throw new InvalidUserIdError('Invalid user ID. Please provide a valid string for user ID.');
      }

      this.sendEmote(targetUserId, emoteId);
    } catch (error) {
      console.error(error.message); // Log the error message
    }
  };

  transport(userId, roomId) {
    try {
      if (!userId || userId === undefined || userId === null) {
        throw new InvalidUserIdError('Invalid user ID. Please provide a valid value for user ID.'.red);
      }
      if (!roomId || typeof roomId !== 'string') {
        throw new InvalidRoomIdError(`Invalid room ID. Please provide a valid value for room ID.`.red);
      }

      const transportRequest = new MoveUserToRoomRequest(userId, roomId);
      const request = {
        _type: 'MoveUserToRoomRequest',
        user_id: transportRequest.user_id,
        room_id: transportRequest.room_id,
        rid: transportRequest.rid
      };

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(request), (error) => {
          if (error) {
            console.error('Error sending transport request:'.red, error);
            throw new HighriseApiError("Error sending TransportRequest:".red);
          }
        });
      }
    } catch (error) {
      console.error(error)
    }
  };

  async teleport(userId, x, y, z, facing = 'FrontRight') {
    try {
      const validFacing = ['BackLeft', 'BackRight', 'FrontLeft', 'FrontRight'];

      if (!userId || userId === undefined || userId === null) {
        throw new InvalidUserIdError('Invalid user ID. Please provide a valid value for user ID.'.red);
      }

      if (x === undefined || x === null || y === undefined || y === null || z === undefined || z === null) {
        throw new InvalidCoordinatesError('Invalid coordinates. Please provide valid values for x, y, and z.'.red);
      }

      if (typeof facing !== 'string') {
        throw new InvalidFacingError('Invalid facing parameter. It must be a string.'.red);
      }

      if (!validFacing.includes(facing)) {
        throw new InvalidFacingError(`Invalid facing parameter (${facing})`.red + `\n` + 'Available Facing Options:'.green + '\n' + `${validFacing.join("\n")}`);
      }

      const dest = new Position(x, y, z, facing);
      this.sendTeleport(userId, dest);
    } catch (error) {
      console.error(error);
    }
  };

  sendTeleport(userId, dest) {
    try {
      if (!userId || userId === undefined || userId === null) {
        throw new InvalidUserIdError('Invalid user ID. Please provide a valid value for user ID.'.red);
      }
      if (!dest || dest === undefined || dest === null) {
        throw new InvalidCoordinatesError('Invalid coordinates. Please provide valid values for x, y, and z.'.red);
      }

      const teleportRequest = new TeleportRequest(userId, dest);
      const request = {
        _type: 'TeleportRequest',
        user_id: teleportRequest.user_id,
        destination: teleportRequest.destination,
        rid: teleportRequest.rid
      };

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(request), (error) => {
          const userData = userMap.get(request.user_id);
          if (userData) {
            userData.position = request.destination;
          }
          if (error) {
            console.error('Error sending teleport request:'.red, error);
            throw new HighriseApiError("Error sending TeleportRequest:".red);
          }
        });
      }

    } catch (error) {
      console.error(error);
    }
  };

  permissions = {
    get: async (userId) => {
      try {

        if (!userId || typeof userId !== 'string') {
          throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
        }
        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const getRoomPrivilegeRequest = new GetRoomPrivilegeRequest(userId);
          const payload = {
            _type: "GetRoomPrivilegeRequest",
            user_id: getRoomPrivilegeRequest.user_id,
            rid: getRoomPrivilegeRequest.rid
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            GetRoomPrivilegeRequest.Response
          );

          return response.content.content;
        }
      } catch (error) {
        const highriseError = new HighriseApiError("Error fetching users permissions:", error);
        this.bot.emit('error', highriseError);
      }
    },

    moderator: {
      add: async (user_id) => {
        if (!user_id || typeof user_id !== 'string') {
          throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
        }
        try {
          const permissions = { moderator: true };
          await this.change(user_id, permissions);
        } catch (error) {
          throw new InvalidUserIdError(`No user found with the ID "${user_id}".`);
        }
      },
      remove: async (user_id) => {
        if (!user_id || typeof user_id !== 'string') {
          throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
        }
        try {
          const permissions = { moderator: false };
          await this.change(user_id, permissions);
        } catch (error) {
          throw new InvalidUserIdError(`No user found with the ID "${user_id}".`);
        }
      }
    },

    designer: {
      add: async (user_id) => {
        if (!user_id || typeof user_id !== 'string') {
          throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
        }
        try {
          const permissions = { designer: true };
          await this.change(user_id, permissions);
        } catch (error) {
          throw new InvalidUserIdError(`No user found with the ID "${user_id}".`);
        }
      },
      remove: async (user_id) => {
        if (!user_id || typeof user_id !== 'string') {
          throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
        }
        try {
          const permissions = { designer: false };
          await this.change(user_id, permissions);
        } catch (error) {
          throw new InvalidUserIdError(`No user found with the ID "${user_id}".`);
        }
      }
    }
  }

  async change(userId, permissions) {
    try {
      const payload = {
        _type: 'ChangeRoomPrivilegeRequest',
        user_id: userId,
        permissions: permissions,
        rid: this.bot.roomId
      };

      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        this.bot.ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            throw new HighriseApiError("Error sending ChangeRoomPrivilegeRequest:".red);
          }
        });
      };
    } catch (error) {
      console.error(error);
    }
  };

  backpack = {
    get: async (userId) => {
      try {

        if (!userId || userId === undefined || userId === null) {
          throw new InvalidUserIdError('Invalid user ID. Please provide a valid value for user ID.'.red);
        }

        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const getBackpackRequest = new GetBackpackRequest(userId);
          const payload = {
            _type: "GetBackpackRequest",
            user_id: getBackpackRequest.user_id,
            rid: getBackpackRequest.rid
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            GetBackpackRequest.Response
          );

          return response.backpack.backpack;
        }

      } catch (error) {
        const highriseError = new HighriseApiError("Error fetching users backpack:", error);
        this.bot.emit('error', highriseError);
      }
    }
  }
  outfit = {
    get: async (userId) => {
      try {

        if (!userId || typeof userId !== 'string') {
          throw new InvalidUserIdError('Invalid user ID. Please provide a valid value for user ID.'.red);
        }

        if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
          const getUserOutfitRequest = new GetUserOutfitRequest(userId);
          const payload = {
            _type: "GetUserOutfitRequest",
            user_id: getUserOutfitRequest.user_id,
            rid: getUserOutfitRequest.rid
          };

          const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
          const response = await sender.sendPayloadAndGetResponse(
            payload,
            GetUserOutfitRequest.Response
          );

          return response.outfit.outfit

        }
      } catch (error) {
        const highriseError = new HighriseApiError("Error fetching users outfit:", error);
        this.bot.emit('error', highriseError);
      }
    }
  }
};

module.exports = { Users };