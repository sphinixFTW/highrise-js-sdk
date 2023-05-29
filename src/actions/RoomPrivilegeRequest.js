const { InvalidUserIdError, HighriseApiError } = require("../handlers/errors");
const { GetRoomPrivilegeRequest, RoomPermissions } = require("../utils/models");

class Mods {
    constructor(bot) {
        this.bot = bot;
    }

    moderator = {
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
    }

    designer = {
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


    async change(userId, permissions) {
        try {
            const payload = {
                _type: 'ChangeRoomPrivilegeRequest',
                user_id: userId,
                permissions: permissions,
                rid: this.bot.roomId
            };
            this.bot.ws.send(JSON.stringify(payload));
        } catch (error) {
            console.error(error);
        }
    }

    async fetch(userIds) {
        try {
            if (!userIds) {
                throw new InvalidUserIdError(`Invalid user IDs. Please provide a valid array of user IDs.`.red);
            }

            if (!Array.isArray(userIds)) {
                userIds = [userIds];
            }

            const requests = userIds.map((userId) => {
                const request = new GetRoomPrivilegeRequest(userId);
                return {
                    _type: "GetRoomPrivilegeRequest",
                    user_id: request.user_id,
                    rid: request.rid,
                };
            });

            const privilegesPromise = new Promise((resolve, reject) => {
                const privileges = [];

                const handleResponse = (message) => {
                    const data = JSON.parse(message);

                    if (data._type === "GetRoomPrivilegeResponse") {
                        const privilege = new RoomPermissions();
                        privilege.moderator = data.content.moderator;
                        privilege.designer = data.content.designer;
                        privileges.push(privilege);
                    }

                    if (privileges.length === userIds.length) {
                        this.bot.ws.off("message", handleResponse);
                        resolve(privileges);
                    }
                };

                this.bot.ws.on("message", handleResponse);

                requests.forEach((payload) => {
                    this.bot.ws.send(JSON.stringify(payload), (error) => {
                        if (error) {
                            reject(error);
                            throw new HighriseApiError(
                                `Error sending GetRoomPrivilegeRequest: ${error}`
                            );
                        }
                    });
                });
            });

            const privileges = await privilegesPromise;
            return privileges;
        } catch (error) {
            console.error(error);
            throw new HighriseApiError(`Error fetching room privileges: ${error}`.red);
        }
    }


}

module.exports = { Mods }
