const { User } = require("../models");

function handleChatEvent(data, emit) {
  try {

    // If a chat event was received, create a User object
    // and extract the message content

    const user = new User(data.user.id, data.user.username);
    const message = typeof data.message === 'string' ? data.message : data.message.text;

    if (data.whisper === false) {
      // If the message was not a whisper, emit a chatMessageCreate event for the user and message
      emit('chatMessageCreate', user, message);
    } else {
      // If the message was a whisper, emit a whisperMessageCreate event for the user and message
      emit('whisperMessageCreate', user, message);
    }
  } catch (error) {
    console.error("Error occurred while handling chat event:", error);
    emit('error', error); // Emit the 'error' event with the error object
  }
}

module.exports = handleChatEvent;