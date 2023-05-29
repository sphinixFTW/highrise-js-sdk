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
## **📘 Documentation**

[Highrise JS SDK Documentation](https://highrise-js.notion.site/Highrise-JS-Documentation-2433f19c38c640d7ae361eefd720fc57)


## **🎐 Events**
- ready
```js
// Event emitted when the bot has successfully connected to the chat server.
bot.on('ready', (session) => {
  console.log(`Bot is now online in ${session.room_info.room_name}.\nBot ID: ${session.user_id}\nOwner ID: ${session.room_info.owner_id}\nRate Limits: ${session.rate_limits.client}\nConnection ID: ${session.connection_id}\nSDK Version: ${session.sdk_version}`)
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
- voiceChatCreate
```js
// Emitted when a player change their voice status in the game.
bot.on('voiceChatCreate', (users, seconds_left) => {
  console.log(`Seconds Left: ${seconds_left}`)
  console.log('Users:');
  users.forEach(({ user, status }) => {
    console.log('User ID:', user.id);
    console.log('Username:', user.username);
    console.log('Status:', status);
    console.log('---');
  });
});
```

## Note

This package is not an official Highrise package, it's self-made by iHsein (sphinix) and is still in beta.

