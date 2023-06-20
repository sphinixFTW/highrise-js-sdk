# **highrise-js-sdk**
<p align="center">
  <img src="https://i.ibb.co/d0vtV49/highrise-logo.png" alt="highrise-logo" />
</p>

> **The Highrise JS SDK is a JavaScript library for writing and running Highrise bots.**

```
[IMPORTANT]: Starting from version 2.0.0, we have made changes to the event handling in the highrise-js-sdk.
This provides you with greater flexibility and control over the types of events you receive when connecting to the SDK.
```

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

const settings = {
  token: 'EXAMPLE-TOKEN',
  room: 'EXAMPLE-ROOM',
  events: ['ready', 'playerJoin', 'playerLeave', 'messages'],
  reconnect: 5
}

const client = new Highrise({ events: settings.events }, settings.reconnect);
client.login(settings.token, settings.room);
```
## **📘 Documentation**

[Highrise JS SDK Documentation](https://highrise-js.notion.site/Highrise-JS-Documentation-2433f19c38c640d7ae361eefd720fc57)

## **Event Handling in highrise-js-sdk**
By default, the 'ready' event is included, ensuring that you receive notifications when the bot is ready and connected to the Highrise server. However, for other events, you need to explicitly include them during the class import.

To include additional events, follow these steps:

1. Import the Highrise class from the highrise-js-sdk package.
2. Specify the events you want to receive by passing them as an array to the events parameter during the class import.
3. Ensure that you import the necessary event handlers or listeners to handle the specific events of interest.

For example:
```js
const { Highrise } = require("highrise-js-sdk");

// Specify the events you want to receive
const eventsOfInterest = ['ready', 'playerJoin', 'playerLeave', 'messages', 'emoteCreate'];

// Create an instance of the Highrise class with the specified events
const bot = new Highrise({ events: eventsOfInterest });

// Continue with the rest of your code and configurations
```
By including the desired events during the class import, you ensure that the corresponding event handlers are set up and triggered when those specific events occur within the Highrise environment.
To learn more about the available events and their descriptions, you can refer to the [Highrise-js SDK Documentation](https://highrise-js.notion.site/Get-Methods-3be2c38eb9cc4866b9dbff4575bf011e).
With the updated event handling mechanism, you have greater control over the types of events you receive, allowing you to tailor the behavior and functionality of your bot according to your specific requirements.

## **🎐 Events**
- ready
```js
// Event emitted when the bot has successfully connected to the chat server.
client.on('ready', (session) => {
  console.log(`Bot is now online in ${session.room_info.room_name}.\nBot ID: ${session.user_id}\nOwner ID: ${session.room_info.owner_id}\nRate Limits: ${session.rate_limits.client}\nConnection ID: ${session.connection_id}\nSDK Version: ${session.sdk_version}`)
});
```
- error
```js
// Event emitted when an error occurs within the package.
client.on('error', (error) => {
  console.log("An Error Occured:", error);
})
```
- chatMessageCreate
```js
// Event emitted when a chat message is created.
client.on('chatMessageCreate', (user, message) => {
  console.log(`[${user.username}]: ${message}`);
});
```
- whisperMessageCreate
```js
// Event emitted when a whisper message is created.
client.on('whisperMessageCreate', (user, message) => {
  console.log(`[${user.username}] (whisper): ${message}`);
});
```
- directMessageCreate
```js
// Event emitted when a direct message is created.
client.on('directMessageCreate', (user, data) => {
  // Process the direct message event
  console.log('Direct message received');
  console.log('User ID:', user);
  console.log('Conversation ID:', data.id);
  console.log('Is New:', data.isNew);

  // Perform additional actions or responses based on the message

  // Example: Send a reply
  client.direct.send(data.id, 'Thank you for your message!');
});
```
- emoteCreate
```js
// Event emitted when an emote is created.
client.on('emoteCreate', (sender, receiver, emote) => {
  console.log(`${sender.username} sent ${emote} to ${receiver.username}`);
});
```
- reactionCreate
```js
// Event emitted when a reaction is created.
client.on('reactionCreate', (sender, receiver, reaction) => {
  console.log(`${sender.username} sent ${reaction} to ${receiver.username}`);
});
```
- tipReactionCreate
```js
// Event emitted when a tip reaction is created.
client.on('tipReactionCreate', (sender, receiver, item) => {
  console.log(`Tip reaction from ${sender.username} to ${receiver.username}: ${item.amount} ${item.type}`);
});
```
- playerJoin
```js
// Emitted when a player joins the room.
client.on('playerJoin', (user) => {
  console.log(`${user.username}(${user.id}) Joined the room`);
});
```
- playerLeave
```js
// Emitted when a player leaves the room.
client.on('playerLeave', (user) => {
  console.log(`${user.username}(${user.id}) Left the room`);
});
```
- trackPlayerMovement
```js
// Emitted when a player moves or teleports in the game.
client.on('trackPlayerMovement', (user, position) => {
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
client.on('voiceChatCreate', (users, seconds_left) => {
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

