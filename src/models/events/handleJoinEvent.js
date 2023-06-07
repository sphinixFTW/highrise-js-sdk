const { User } = require("../models");

function handleUserJoinedEvent(data, emit) {
  try {
    // If a user joined event was received, create a User object and emit a playerJoin event

    const user = new User(data.user.id, data.user.username);
    emit('playerJoin', user);
  } catch (error) {
    console.error("Error occurred while handling user join event:", error);
    emit('error', error); // Emit the 'error' event with the error object
  }
}

module.exports = handleUserJoinedEvent;