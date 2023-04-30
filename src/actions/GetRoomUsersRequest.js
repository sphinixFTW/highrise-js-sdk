const { HighriseApiError, InvalidUserIdError, InvalidNameError } = require("../handlers/errors");
const { GetRoomUsersRequest, sendPayloadAndGetResponse } = require("../utils/models");
const reqId = Math.floor(Math.random() * 1000);
class RoomUsers {
    constructor(bot) {
        this.bot = bot;
    }

    async fetch() {
        try {
            const request = new GetRoomUsersRequest(reqId.toString());
            const payload = {
                _type: 'GetRoomUsersRequest',
                rid: request.rid,
            };
            const response = await new sendPayloadAndGetResponse(this.bot).sendPayloadAndGetResponse(payload);
            return response.content;

        } catch (error) {
            console.error(error);
            throw new HighriseApiError("Error fetching room users:".red);
        }
    }

    async getPosition(userIds) {
        try {
            const users = await this.fetch();
            if (!Array.isArray(userIds)) {
                userIds = [userIds];
            }
            if (!userIds) {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
            }
            const positions = userIds.map(userId => {
                const user = users.find(u => u[0].id === userId);
                if (!user) {
                    throw new Error(`User with ID ${userId} is not in the room`.red);
                }
                return user[1];
            });
            return positions;
        } catch (error) {
            return console.log(error)
        }
    }

    async getId(userNames) {
        try {
            const users = await this.fetch();
            if (!Array.isArray(userNames)) {
                userNames = [userNames];
            }
            if (!userNames) {
                throw new InvalidNameError(`User Name is not valid`.red)
            }
            const ids = userNames.map(userName => {
                const user = users.find(u => u[0].username === userName);
                if (!user) {
                    throw new Error(`User with username ${userName} is not in the room`.red);
                }
                return user[0].id;
            });
            return ids;
        } catch (error) {
            return console.log(error)
        }
    }

    async getName(userIds) {
        try {
            const users = await this.fetch();
            if (!Array.isArray(userIds)) {
                userIds = [userIds];
            }

            if (!userIds) {
                throw new InvalidUserIdError('Invalid user ID. Please provide valid value for user ID.'.red);
            }
            const names = userIds.map(userId => {
                const user = users.find(u => u[0].id === userId);
                if (!user) {
                    throw new Error(`User with ID ${userId} is not in the room`.red);
                }
                return user[0].username;
            });
            return names;
        } catch (error) {
            return console.log(error)
        }

    }
}

module.exports = { RoomUsers }