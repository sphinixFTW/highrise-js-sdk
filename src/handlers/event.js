const { User, Position, AnchorPosition } = require("../utils/models")

let BotId;

/**
 * Handle incoming chat events, user joined events, user left events, emote events, reaction events, tip reaction events, and user moved events.
 * @param {Object} event - The event object received.
 * @param {string} event.data - The data received in the event.
 */
function handleMessageEvent(event) {
    const data = JSON.parse(event.data);
    // Check the _type field to determine what type of message we received
    if (data._type !== 'KeepaliveResponse') {
        /*const sessionMetadata = JSON.parse(event.data);
        for (const prop in sessionMetadata) {
            console.log(`${prop + ': ' + sessionMetadata[prop]}`.yellow);
        }*/
    }
    if (data._type === 'SessionMetadata') {
        BotId = data.user_id;
        const rateLimits = data.rate_limits;
        const connectionId = data.connection_id;
        const packageJson = require('../../package.json');
        const version = packageJson.version;
        this.emit('ready', BotId || null, rateLimits, connectionId, version);
    }
    let user;
    let message;
    if (data._type === 'ChatEvent' && data.user.id !== BotId) {
        // If a chat event was received and the sender is not the bot, create a User object
        // and extract the message content
        user = new User(data.user.id, data.user.username);
        message = typeof data.message === 'string' ? data.message : data.message.text;

        if (data.whisper === false) {
            // If the message was not a whisper, emit a chatMessageCreate event for the user and message
            // but ignore the message if the sender is the bot
            if (user.id === this.botUserId) {
                return; // Exit if the user is the bot
            }
            this.emit('chatMessageCreate', user, message);
        } else {
            // If the message was a whisper, emit a whisperMessageCreate event for the user and message
            this.emit('whisperMessageCreate', user, message);
        }
    } else if (data._type === 'UserJoinedEvent') {
        // If a user joined event was received, create a User object and emit a playerJoin event
        user = new User(data.user.id, data.user.username);
        this.emit('playerJoin', user);
    } else if (data._type === 'UserLeftEvent') {
        // If a user left event was received, create a User object and emit a playerLeave event
        user = new User(data.user.id, data.user.username);
        this.emit('playerLeave', user);
    } else if (data._type === 'EmoteEvent') {
        // If an emote event was received, create User objects for the sender and receiver,
        // and emit an emoteCreate event for the sender, receiver, and emote ID
        const sender = new User(data.user.id, data.user.username)
        const receiver = new User(data.receiver.id, data.receiver.username)
        const emoteId = data.emote_id
        this.emit('emoteCreate', sender, receiver, emoteId)
    } else if (data._type === 'ReactionEvent') {
        // If a reaction event was received, create User objects for the sender and receiver,
        // and emit a reactionCreate event for the sender, receiver, and reaction
        const sender = new User(data.user.id, data.user.username);
        const receiver = new User(data.receiver.id, data.receiver.username)
        const reaction = data.reaction
        this.emit('reactionCreate', sender, receiver, reaction)
    } else if (data._type === 'TipReactionEvent') {
        // If a tip reaction event was received, create User objects for the sender and receiver,
        // and emit a tipReactionCreate event for the sender, receiver, and item
        const sender = new User(data.sender.id, data.sender.username);
        const receiver = new User(data.receiver.id, data.receiver.username);
        const item = data.item;
        this.emit('tipReactionCreate', sender, receiver, item)
    } else if (data._type === 'UserMovedEvent') {
        // If a user moved event was received, create a User object and extract the position data.
        // Depending on the type of position data received, emit a TrackPlayerMovement event for the user
        const user = new User(data.user.id, data.user.username);
        if ('x' in data.position && 'y' in data.position && 'z' in data.position) {
            const dest = new Position(data.position.x, data.position.y, data.position.z, data.position.facing);
            this.emit('TrackPlayerMovement', user, dest);
        } else if ('entity_id' in data.position && 'anchor_ix' in data.position) {
            const anchor = new AnchorPosition(data.position.entity_id, data.position.anchor_ix);
            this.emit('TrackPlayerMovement', user, anchor);
        }
    }

}

module.exports = handleMessageEvent;
