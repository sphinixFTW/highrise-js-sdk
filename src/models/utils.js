// create a new map for storing cache.
const userMap = new Map();

const eventTypeMap = {
  SessionMetadata: 'ready',
  ChatEvent: 'messages',
  MessageEvent: 'directMessageCreate',
  UserJoinedEvent: 'playerJoin',
  UserLeftEvent: 'playerLeave',
  EmoteEvent: 'emoteCreate',
  ReactionEvent: 'reactionCreate',
  TipReactionEvent: 'tipReactionCreate',
  UserMovedEvent: 'trackPlayerMovement',
  VoiceEvent: 'voiceChatCreate'
};

module.exports = { eventTypeMap, userMap };
