const { userMap } = require("../models/utils");
const { HighriseApiError, InvalidUserIdError, InvalidNameError } = require("../handlers/errors");
const { GetRoomUsersRequest, SendPayloadAndGetResponse } = require("../models/models");

class RoomUsers {
  constructor(bot) {
    this.bot = bot;
    this.userMap = userMap;
    this.reqId = Math.floor(Math.random() * 1000);
    this.bot.on('ready', async () => {
      try {
        await this.fetchUserMap();
      } catch (error) {
        console.error(error);
      }
    });
    if (this.bot.eventTypesOfInterest.includes('playerJoin')) {
      this.bot.on('playerJoin', async (user) => {
        try {

          this.addUserToMap(user.id, {
            position: { x: 0, y: 0, z: 0, facing: 'FrontRight' },
            id: user.id,
            username: user.username,
          });

        } catch (error) {
          console.error(error);
        }
      });
    }
    if (this.bot.eventTypesOfInterest.includes('playerLeave')) {
      this.bot.on('playerLeave', async (user) => {
        try {

          this.removeUserFromMap(user.id);

        } catch (error) {
          console.error(error);
        }
      });
    }
    if (this.bot.eventTypesOfInterest.includes('trackPlayerMovement')) {
      this.bot.on('trackPlayerMovement', async (user, position) => {
        try {
          const userData = this.userMap.get(user.id);
          if (userData) {
            userData.position = position;
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
  }

  async fetchUserMap() {
    try {
      const users = await this.fetch();

      for (const [userObj, positionObj] of users) {
        const userData = {
          id: userObj.id, // Include the 'id' property
          username: userObj.username, // Include the 'username' property
          position: positionObj,
        };
        this.userMap.set(userObj.id, userData);
      }
    } catch (error) {
      const highriseError = new HighriseApiError("Error fetching room users:", error);
      this.bot.emit('error', highriseError);
    }
  }


  addUserToMap(userId, userData) {
    this.userMap.set(userId, userData);
  }

  removeUserFromMap(userId) {
    this.userMap.delete(userId);
  }

  cache = {
    get: () => {
      const userMapValues = [...this.userMap.values()];
      const result = userMapValues.map(user => [{ id: user.id, username: user.username }, user.position]);
      return result;
    },
    id: (username) => {
      try {
        const user = [...this.userMap.values()].find(user => user.username === username);
        if (user) return user.id;
      } catch (error) {
        throw new InvalidNameError(`No user found with the name "${username}".`);
      }
    },
    position: (userId) => {
      try {
        const user = this.userMap.get(userId);
        if (user) return user.position;
      } catch (error) {
        throw new InvalidUserIdError(`No user found with the ID "${userId}".`);
      }
    },
    username: (userId) => {
      try {
        const user = this.userMap.get(userId);
        if (user) return user.username;
      } catch (error) {
        throw new InvalidUserIdError(`No user found with the ID "${userId}".`);
      }
    }
  };



  async fetch() {
    try {
      if (this.bot.ws.readyState === this.bot.websocket.OPEN) {
        const getRoomUsersRequest = new GetRoomUsersRequest(this.reqId.toString());
        const payload = {
          _type: "GetRoomUsersRequest",
          rid: getRoomUsersRequest.rid,
          content: getRoomUsersRequest.content
        };

        const sender = new SendPayloadAndGetResponse(this.bot); // Create an instance of SendPayloadAndGetResponse
        const response = await sender.sendPayloadAndGetResponse(
          payload,
          GetRoomUsersRequest.Response
        );

        return response.content.content;
      }
    } catch (error) {
      console.error(error);
      const highriseError = new HighriseApiError("Error fetching room users:", error);
      this.bot.emit('error', highriseError);
    }
  };

  async getPosition(userId) {
    try {
      const users = await this.fetch();
      if (!userId) {
        throw new InvalidUserIdError('Invalid user ID. Please provide a valid value for user ID.'.red);
      }
      const user = users.find(u => u[0].id === userId);
      if (!user) {
        throw new Error(`User with ID ${userId} is not in the room`.red);
      }
      return user[1];
    } catch (error) {
      console.error(error);
    }
  };

  async getId(userName) {
    try {
      const users = await this.fetch();
      if (!userName) {
        throw new InvalidNameError(`User Name is not valid`.red);
      }
      const user = users.find(u => u[0].username === userName);
      if (!user) {
        throw new Error(`User with username ${userName} is not in the room`.red);
      }
      return user[0].id;
    } catch (error) {
      console.error(error);
    }
  };

  async getName(userId) {
    try {
      const users = await this.fetch();
      if (!userId) {
        throw new InvalidUserIdError('Invalid user ID. Please provide a valid value for user ID.'.red);
      }
      const user = users.find(u => u[0].id === userId);
      if (!user) {
        throw new Error(`User with ID ${userId} is not in the room`.red);
      }
      return user[0].username;
    } catch (error) {
      console.error(error);
    }
  };


}

module.exports = { RoomUsers };
