# **highrise-js-sdk**
<p align="center">
  <img src="https://i.ibb.co/d0vtV49/highrise-logo.png" alt="highrise-logo" />
</p>

> **The Highrise JS SDK is a JavaScript library for writing and running Highrise bots.**

## **⚙️ Installation** 
```
npm i highrise-js-sdk@latest
```

## **✨ Features**

- Easy to use.
- Beginner friendly.
- Auto reconnect system.
- Supports Node version 10+

## **📥 Class Import**
```js
const { Highrise } = require("highrise-js-sdk")
const bot = new Highrise(token, roomID);
```

## **🎐 Events**
- ready
```js
// Event emitted when the bot has successfully connected to the chat server.
bot.on('ready', (BotId, rateLimits, connectionId, version) => {
  console.log(`The bot is now online: BotId=${BotId}, rateLimits=${rateLimits}, connectionId=${connectionId}, sdkVersion=${version}`);
});
```
- chatMessageCreate
```js
// Event emitted when a chat message is created.
bot.on('chatMessageCreate', (user, message) => {
  console.log(`[${user.username}]: ${message}`);
});
```
- whisperMessageCreate
```js
// Event emitted when a whisper message is created.
bot.on('whisperMessageCreate', (user, message) => {
  console.log(`[${user.username}] (whisper): ${message}`);
});
```
- emoteCreate
```js
// Event emitted when an emote is created.
bot.on('emoteCreate', (sender, receiver, emote) => {
  console.log(`${sender.username} sent ${emote} to ${receiver.username}`);
});
```
- reactionCreate
```js
// Event emitted when a reaction is created.
bot.on('reactionCreate', (sender, receiver, reaction) => {
  console.log(`${sender.username} sent ${reaction} to ${receiver.username}`);
});
```
- tipReactionCreate
```js
// Event emitted when a tip reaction is created.
bot.on('tipReactionCreate', (sender, receiver, item) => {
  console.log(`Tip reaction from ${sender.username} to ${receiver.username}: ${item.amount} ${item.type}`);
});
```
- playerJoin
```js
// Emitted when a player joins the room.
bot.on('playerJoin', (user) => {
  console.log(`${user.username}(${user.id}) Joined the room`);
});
```
- playerLeave
```js
// Emitted when a player leaves the room.
bot.on('playerLeave', (user) => {
  console.log(`${user.username}(${user.id}) Left the room`);
});
```
- TrackPlayerMovement
```js
// Emitted when a player moves or teleports in the game.
bot.on('TrackPlayerMovement', (user, position) => {
  if ('x' in position && 'y' in position && 'z' in position && 'facing' in position) {
    console.log(`${user.username} moved to ${position.x}, ${position.y}, ${position.z}, ${position.facing}`);
  } else if ('entity_id' in position && 'anchor_ix' in position) {
    console.log(`${user.username} moved to anchor ${position.entity_id} at index ${position.anchor_ix}`);
  }
});
```
## **📜 Methods**
- Sending Messages
```js
bot.message.send(message);
bot.whisper.send(user.id, message);

const filter = (u) => u.id === user.id;
bot.chat.awaitMessages({ filter: filter, max: 1, idle: 1000 }).then((response) => {
  console.log(response);
});

const filter = (s, r) => s.id === user.id && r.id === 'id';
bot.chat.awaitReactions({ filter: filter, max: 1, idle: 1000 }).then((reaction) => {
  console.log(reaction);
});
```
- player control
```js
// Teleportation:
bot.player.teleport(user.id, x, y, z, facing);
bot.player.transport(user.id, roomId);
// Emotes & Reactions:
bot.player.emote(user.id, emoteID);
bot.player.react(user.id, reaction);
// Moderation:
bot.player.kick(user.id);
bot.player.ban(user.id, duration);
bot.player.unban(user.id);
bot.player.mute(user.id, duration);
bot.player.unmute(user.id);
```
- Player Privilages
```js
await bot.privilege.fetch(userIds);
const permissions = { moderator: true, designer: true };
await bot.privilege.change(user.id, permissions);
```
- Player List & Cache
```js
// Directly from the api.
await bot.room.players.fetch();
await bot.room.players.getPosition(user.id);
await bot.room.players.getId(user.username);
await bot.room.players.getName(user.id);
// Fetch data from the cache.
await bot.room.players.cache.get();
await bot.room.players.cache.position(user.id);
await bot.room.players.cache.id(user.username);
await bot.room.players.cache.username(user.id);
```
- Client Control
```js
bot.move.walk(x, y, z, facing);
bot.move.sit(entity_id, anchor_ix);
await bot.indicator.set(icon);
await bot.ping.get();
await bot.wallet.fetch();
await bot.wallet.type();
await bot.wallet.amount();
```
## **📚 More In Depth**
```js
/**
 * Event emitted when the bot has successfully connected to the chat server.
 * @event ready
 * @param {string} BotId - The ID of the bot.
 * @param {object} rateLimits - The rate limits associated with the bot.
 * @param {string} connectionId - The connection ID of the bot.
 * @param {string} sdkVersion - The version of the SDK being used.
 */
bot.on('ready', (BotId, rateLimits, connectionId, sdkVersion) => {
  console.log(`The bot is now online: BotId=${BotId}, rateLimits=${rateLimits}, connectionId=${connectionId}, sdkVersion=${sdkVersion}`);
});
/**
 * Event emitted when a chat message is created.
 * @event chatMessageCreate
 * @param {User} user - The user who sent the message.
 * @param {string} message - The message that was sent.
 */
bot.on('chatMessageCreate', (user, message) => {
  console.log(`[${user.username}]: ${message}`);
});
/**
 * Event emitted when a whisper message is created.
 * @event whisperMessageCreate
 * @param {User} user - The user who sent the whisper message.
 * @param {string} message - The message that was sent.
 */
bot.on('whisperMessageCreate', (user, message) => {
  console.log(`[${user.username}] (whisper): ${message}`);
});
/**
 * Event emitted when an emote is created.
 * @event emoteCreate
 * @param {User} sender - The user who sent the emote.
 * @param {User} receiver - The user who received the emote.
 * @param {string} emote - The emote that was sent.
 */
bot.on('emoteCreate', (sender, receiver, emote) => {
  console.log(`${sender.username} sent ${emote} to ${receiver.username}`);
});
/**
 * Event emitted when a reaction is created.
 * @event reactionCreate
 * @param {User} sender - The user who sent the reaction.
 * @param {User} receiver - The user who received the reaction.
 * @param {string} reaction - The reaction that was sent.
 */
bot.on('reactionCreate', (sender, receiver, reaction) => {
  console.log(`${sender.username} sent ${reaction} to ${receiver.username}`);
});
/**
 * Event emitted when a tip reaction is created.
 * @event tipReactionCreate
 * @param {User} sender - The user who sent the tip reaction.
 * @param {User} receiver - The user who received the tip reaction.
 * @param {object} item - The item containing the amount and type of the tip reaction.
 * @param {number} item.amount - The amount of tokens sent in the tip reaction.
 * @param {string} item.type - The type of the tip reaction (e.g. "hearts", "diamonds", etc.).
 */
bot.on('tipReactionCreate', (sender, receiver, item) => {
  console.log(`Tip reaction from ${sender.username} to ${receiver.username}: ${item.amount} ${item.type}`);
});
/**
 * Emitted when a player joins the room.
 *
 * @event bot#playerJoin
 * @param {object} user - The user object for the player who joined the room.
 * @param {string} user.username - The username of the player who joined the room.
 * @param {string} user.id - The ID of the player who joined the room.
 */
bot.on('playerJoin', (user) => {
  console.log(`${user.username}(${user.id}) Joined the room`);
});
/**
 * Emitted when a player leaves the room.
 *
 * @event bot#playerLeave
 * @param {object} user - The user object for the player who left the room.
 * @param {string} user.username - The username of the player who left the room.
 * @param {string} user.id - The ID of the player who left the room.
 */
bot.on('playerLeave', (user) => {
  console.log(`${user.username}(${user.id}) Left the room`);
});
/**
 * Emitted when a player moves or teleports in the game.
 *
 * @event bot#TrackPlayerMovement
 * @param {object} user - The user object containing the player's id and username. 
 * @param {object} position - The position object containing the player's location and facing direction.
 * @param {object} user - The user object containing the player's id and username. 
 * @param {number} position.x - The X coordinate of the player's position.
 * @param {number} position.y - The Y coordinate of the player's position.
 * @param {number} position.z - The Z coordinate of the player's position.
 * @param {string} position.facing - The direction the player is facing ('north', 'east', 'south', or 'west').
 * @param {number} position.entity_id - The ID of the entity the player is moving towards.
 * @param {number} position.anchor_ix - The index of the anchor the player is moving towards.
 */
bot.on('TrackPlayerMovement', (user, position) => {
  if ('x' in position && 'y' in position && 'z' in position && 'facing' in position) {
    console.log(`${user.username} moved to ${position.x}, ${position.y}, ${position.z}, ${position.facing}`);
  } else if ('entity_id' in position && 'anchor_ix' in position) {
    console.log(`${user.username} moved to anchor ${position.entity_id} at index ${position.anchor_ix}`);
  }
});
/**
 * Sends a whisper to the specified user.
 * @param {number} userId - The ID of the user to whisper to.
 * @param {string} message - The message to send.
 */
bot.whisper.send(user.id, 'message')
/**
 * Sends a message to the current room.
 * @param {string} message - The message to send.
 */
bot.message.send('message')
/**
 * Awaits and logs the response message from the bot's chat.
 *
 * @param {Object} bot - The bot instance.
 * @param {Object} user - The user object.
 */
const filter = (u) => u.id === user.id;
bot.chat.awaitMessages({ filter: filter, max: 1, idle: 1000 }).then((response) => {
  console.log(response);
});

/**
 * Awaits and logs the reaction from the bot's chat.
 *
 * @param {Object} bot - The bot instance.
 * @param {Object} user - The user object.
 */
const filter = (s, r) => s.id === user.id && r.id === 'id';
bot.chat.awaitReactions({ filter: filter, max: 1, idle: 1000 }).then((reaction) => {
  console.log(reaction);
});

/**
 * Fetches information about all players in the current room.
 * @returns {Promise<Object[]>} - A promise that resolves with an array of player objects.
 */
await bot.room.players.fetch()
/**
 * Gets the position of the specified player.
 * @param {number} userId - The ID of the player to get the position of.
 * @returns {Promise<Object>} - A promise that resolves with an object containing the player's x, y, z, and facing values.
 */
await bot.room.players.getPosition(user.id)
/**
 * Gets the ID of the player with the specified name.
 * @param {string} username - The name of the player to get the ID of.
 * @returns {Promise<number>} - A promise that resolves with the player's ID.
 */
await bot.room.players.getId(user.username)
/**
 * Gets the name of the player with the specified ID.
 * @param {number} userId - The ID of the player to get the name of.
 * @returns {Promise<string>} - A promise that resolves with the player's name.
 */
await bot.room.players.getName(user.id)
/**
 * Teleports the specified player to the specified position.
 * @param {number} userId - The ID of the player to teleport.
 * @param {number} x - The x coordinate to teleport to.
 * @param {number} y - The y coordinate to teleport to.
 * @param {number} z - The z coordinate to teleport to.
 * @param {number} facing - The facing direction to teleport to.
 */
bot.player.teleport(user.id, x, y, z, facing)
/**
 * Performs the specified emote on the specified player.
 * @param {number} userId - The ID of the player to perform the emote on.
 * @param {number} emoteID - The ID of the emote to perform.
 */
bot.player.emote(user.id, emoteID)
/**
 * Sends the specified reaction to the specified player.
 * @param {number} userId - The ID of the player to send the reaction to.
 * @param {string} reaction - The reaction to send.
 */
bot.player.react(user.id, reaction)
/**
 * Kicks the specified player from the room.
 * @param {number} userId - The ID of the player to kick.
 */
bot.player.kick(user.id)
/**
 * Bans the specified player from the room.
 * @param {number} userId - The ID of the player to ban.
 * @param {number} duration - The duration of the ban in seconds.
 */
bot.player.ban(user.id, duration)
/**
 * Unbans the specified player from the room.
 * @param {number} userId - The ID of the player to unban.
 */
bot.player.unban(user.id)
/**
 * Mutes the specified player.
 * @param {number} userId - The ID of the player to mute.
 * @param {number} duration - The duration of the mute in seconds.
 */
bot.player.mute(user.id, duration)
/**
 * Unmutes the specified player.
 * @param {number} userId - The ID of the player to unmute.
 */
bot.player.unmute(user.id)
/**
 * Move a player to another room
 * @param {string} user.id - The ID of the player to move
 * @param {string} roomId - The ID of the room to move the player to
 */
bot.player.transport(user.id, roomId);
/**
 * Change the privileges of a player
 * @param {string} user.id - The ID of the player to change the privileges of
 * @param {Object} permissions - The permissions to assign to the player
 * @param {boolean} permissions.moderator - Whether the player should be a moderator
 * @param {boolean} permissions.designer - Whether the player should be a designer
 */
const permissions = { moderator: true, designer: true };
await bot.privilege.change(user.id, permissions);
/**
 * Get the privileges of multiple players
 * @param {string[]} userIds - An array of player IDs to get privileges for
 * @returns {Promise<Object>} A promise that resolves with an object mapping player IDs to their privileges
 */
await bot.privilege.fetch(userIds);
/**
 * Get the ping of the bot
 * @returns {Promise<number>} A promise that resolves with the ping of the bot in milliseconds
 */
await bot.ping.get();
/**
 * Move the bot to a different position
 * @param {number} x - The x coordinate to move to
 * @param {number} y - The y coordinate to move to
 * @param {number} z - The z coordinate to move to
 * @param {number} facing - The direction the bot should be facing (in degrees)
 */
bot.move.walk(x, y, z, facing);
/**
 * Move the bot to a specific anchor position.
 * @param {string} entity_id - The ID of the entity.
 * @param {number} anchor_ix - The index of the anchor.
 */
bot.move.sit(entity_id, anchor_ix);
/**
 * Set the bot's indicator icon
 * @param {string} icon - The name of the icon to set as the bot's indicator
 * @returns {Promise<void>} A promise that resolves once the indicator has been set
 */
await bot.indicator.set(icon);
```
## Note

This package is not an official Highrise package, it's self-made by iHsein (sphinix) and is still in beta.

