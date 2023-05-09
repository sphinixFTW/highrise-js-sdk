const { InvalidUserIdError, InvalidCoordinates, HighriseApiError, InvalidDuration, InvalidRoomId } = require("../handlers/errors");
const { TeleportRequest, Position, ModerateRoomRequest, ReactionRequest, EmoteRequest, MoveUserToRoomRequest, userMap } = require("../utils/models");

class Users {
    constructor(bot) {
        this.bot = bot;
    }

    async react(targetUserId, reaction) {
        try {

            const emoteIdMap = ReactionRequest.getReactionMap();
            if (!ReactionRequest.isValidReaction(reaction)) {
                console.error(`Invalid reaction '${reaction}'`.red + `\n` + `Available Reactions:`.green + `\n` + `${Object.keys(emoteIdMap).join("\n")}`);
                return;
            }

            if (!targetUserId || typeof targetUserId !== 'string') {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
            }

            const reactionRequest = new ReactionRequest(targetUserId, reaction);
            const payload = reactionRequest.toPayload();

            this.bot.ws.send(JSON.stringify(payload), (error) => {
                if (error) {
                    throw new HighriseApiError("Error sending ReactionRequest:".red);
                }
            });

        } catch (error) {
            console.error(error)
        }
    }

    async _do_req_no_resp(request) {
        try {
            const payload = {
                _type: "ModerateRoomRequest",
                user_id: request.user_id,
                moderation_action: request.moderation_action,
                action_length: request.action_length !== undefined ? request.action_length : null,
                rid: request.rid
            };

            return new Promise((resolve, reject) => {
                this.bot.ws.send(JSON.stringify(payload), error => {
                    if (error) {
                        console.error("Error sending ModerateRoomRequest:".red, error);
                        reject(error);
                        throw new HighriseApiError("Error sending ModerateRoomRequest:".red)
                    } else {
                        resolve();
                    }
                });
            });

        } catch (error) {
            console.error(error)
        }
    }

    async kick(user_id) {
        try {
            if (!user_id || typeof user_id !== 'string') {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
            }
            await this._do_req_no_resp(
                new ModerateRoomRequest(user_id, "kick")
            );
        } catch (error) {
            console.log(error)
        }
    }

    async ban(user_id, seconds) {
        try {
            if (!user_id || typeof user_id !== 'string') {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
            }
            if (!Number.isInteger(seconds)) {
                throw new InvalidDuration('Invalid duration. Duration must be an integer.'.red);
            }
            await this._do_req_no_resp(
                new ModerateRoomRequest(user_id, "ban", seconds)
            );
        } catch (error) {
            console.log(error)
        }
    }

    async mute(user_id, seconds) {
        try {
            if (!user_id || typeof user_id !== 'string') {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
            }
            if (!Number.isInteger(seconds)) {
                throw new InvalidDuration('Invalid duration. Duration must be an integer.'.red);
            }
            await this._do_req_no_resp(
                new ModerateRoomRequest(user_id, "mute", seconds)
            );
        } catch (error) {
            console.log(error)
        }
    }

    async unmute(user_id) {
        try {
            if (!user_id || typeof user_id !== 'string') {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
            }
            await this._do_req_no_resp(
                new ModerateRoomRequest(user_id, "mute", 1)
            );
        } catch (error) {
            console.log(error)
        }
    }

    async unban(user_id) {
        try {
            if (!user_id || typeof user_id !== 'string') {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
            }
            await this._do_req_no_resp(
                new ModerateRoomRequest(user_id, "unban", null)
            );
        } catch (error) {
            console.log(error)
        }

    }

    async emote(targetUserId, emoteId) {
        try {
            if (!emoteId) {
                throw new InvalidEmoteId('Invalid emote ID'.red)
            }
            if (!targetUserId) {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
            }

            this.sendEmote(targetUserId, emoteId);
        } catch (error) {
            console.error(error);
        }
    }

    sendEmote(targetUserId, emoteId) {
        try {
            const emoteRequest = new EmoteRequest(targetUserId, emoteId);

            const payload = {
                _type: 'EmoteRequest',
                emote_id: emoteRequest.emote_id,
                target_user_id: emoteRequest.target_user_id,
                rid: emoteRequest.rid
            };

            this.bot.ws.send(JSON.stringify(payload), (error) => {
                if (error) {
                    this.bot.reconnect();
                    console.error("Error sending EmoteRequest:".red, error);
                    throw new HighriseApiError("Error sending EmoteRequest:".red)
                }
            });
        } catch (error) {
            console.error(error);
        }
    }


    transport(userIds, roomId) {
        try {
            if (!Array.isArray(userIds)) {
                userIds = [userIds];
            }
            if (userIds.some(userId => !userId || userId === undefined || userId === null)) {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value(s) for user ID.'.red);
            }
            if (!roomId) {
                throw new InvalidRoomId(`Invalid room ID. Please provide valid value for room ID.`.red);
            }

            const requests = userIds.map(userId => {
                const transportRequest = new MoveUserToRoomRequest(userId, roomId);
                return {
                    _type: 'MoveUserToRoomRequest',
                    user_id: transportRequest.user_id,
                    room_id: transportRequest.room_id,
                    rid: transportRequest.rid
                };
            });

            requests.forEach(request => {
                this.bot.ws.send(JSON.stringify(request), (error) => {
                    if (error) {
                        console.error('Error sending transport request:'.red, error);
                        throw new HighriseApiError("Error sending TransportRequest:".red);
                    }
                });
            });
        } catch (error) {
            console.error(error)
        }
    }

    async teleport(userIds, x, y, z, facing) {
        try {
            if (!Array.isArray(userIds)) {
                userIds = [userIds];
            }
            if (userIds.some(userId => !userId || userId === undefined || userId === null)) {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value(s) for user ID.'.red);
            }
            if (x === undefined || x === null || y === undefined || y === null || z === undefined || z === null) {
                throw new InvalidCoordinates('Invalid coordinates. Please provide valid values for x, y, and z.'.red)
            }

            if (typeof facing !== 'string') {
                throw new Error('Invalid facing parameter. Must be a string.'.red);
            }

            const dest = new Position(x, y, z, facing);
            this.sendTeleport(userIds, dest);
        } catch (error) {
            console.error(error);
        }
    }

    sendTeleport(userIds, dest) {
        try {
            if (!Array.isArray(userIds)) {
                userIds = [userIds];
            }
            if (userIds.some(userId => !userId || userId === undefined || userId === null)) {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value(s) for user ID.'.red);
            }
            if (!dest || dest === undefined || dest === null) {
                throw new InvalidCoordinates('Invalid coordinates. Please provide valid values for x, y, and z.'.red)
            }

            const requests = userIds.map(userId => {
                const teleportRequest = new TeleportRequest(userId, dest);
                return {
                    _type: 'TeleportRequest',
                    user_id: teleportRequest.user_id,
                    destination: teleportRequest.destination,
                    rid: teleportRequest.rid
                };
            });

            requests.forEach(request => {
                this.bot.ws.send(JSON.stringify(request), (error) => {
                    const userData = userMap.get(request.user_id);
                    if (userData) {
                        userData.position = request.destination
                    }
                    if (error) {
                        console.error('Error sending teleport request:'.red, error);
                        throw new HighriseApiError("Error sending TeleportRequest:".red);
                    }
                });
            });
        } catch (error) {
            console.error(error)
        }
    }

}

module.exports = { Users }