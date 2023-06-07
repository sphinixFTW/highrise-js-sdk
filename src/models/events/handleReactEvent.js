const { User } = require("../models");

function handleReactEvent(data, emit) {
  try {
    // If a reaction event was received, create User objects for the sender and receiver,
    // and emit a reactionCreate event for the sender, receiver, and reaction

    const sender = new User(data.user.id, data.user.username);
    const receiver = new User(data.receiver.id, data.receiver.username)
    const reaction = data.reaction

    emit('reactionCreate', sender, receiver, reaction);
  } catch (error) {
    console.error("Error occurred while handling reaction event:", error);
    emit('error', error); // Emit the 'error' event with the error object
  }
}

module.exports = handleReactEvent;
