const { User } = require("../models");

function handleEmoteEvent(data, emit) {
  try {

    const sender = new User(data.user.id, data.user.username)
    const receiver = new User(data.receiver.id, data.receiver.username)
    const emoteId = data.emote_id

    emit('emoteCreate', sender, receiver, emoteId);
  } catch (error) {
    console.error("Error occurred while handling emote event:", error);
    emit('error', error); // Emit the 'error' event with the error object
  }
}

module.exports = handleEmoteEvent;