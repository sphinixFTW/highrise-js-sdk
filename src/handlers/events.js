const { eventTypeMap } = require("../models/utils");

const handleChatEvent = require("../models/events/handleChatEvent");
const handleUserJoinedEvent = require("../models/events/handleJoinEvent");
const handleUserLeftEvent = require("../models/events/handleLeaveEvent");
const handleEmoteEvent = require("../models/events/handleEmoteEvent");
const handleReadyEvent = require("../models/events/handleReadyEvent");
const handleReactEvent = require("../models/events/handleReactEvent");
const handleTipsEvent = require("../models/events/handleTipsEvent");
const handleMovementEvent = require("../models/events/handleMovementEvent");
const handleVoiceEvent = require("../models/events/handleVoiceEvent");
const handleDMEvent = require("../models/events/handleDMEvent");

function handleMessageEvent(event, highriseInstance) {
  try {
    const data = JSON.parse(event.data);
    const emit = this.emit.bind(this);

    if (highriseInstance.includes(eventTypeMap[data._type])) {
      const eventType = eventTypeMap[data._type];

      if (eventType === 'ready') {
        handleReadyEvent(data, emit);
      } else if (eventType === 'messages') {
        handleChatEvent(data, emit);
      } else if (eventType === 'playerJoin') {
        handleUserJoinedEvent(data, emit);
      } else if (eventType === 'playerLeave') {
        handleUserLeftEvent(data, emit);
      } else if (eventType === 'emoteCreate') {
        handleEmoteEvent(data, emit);
      } else if (eventType === 'reactionCreate') {
        handleReactEvent(data, emit);
      } else if (eventType === 'tipReactionCreate') {
        handleTipsEvent(data, emit);
      } else if (eventType === 'trackPlayerMovement') {
        handleMovementEvent(data, emit);
      } else if (eventType === 'voiceChatCreate') {
        handleVoiceEvent(data, emit);
      } else if (eventType === 'directMessageCreate') {
        handleDMEvent(data, emit);
      }
    }
  } catch (error) {
    console.error(`Error occurred while handling the API events:`, error);
  }
}

module.exports = handleMessageEvent;
