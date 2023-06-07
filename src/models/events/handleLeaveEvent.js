const { User } = require("../models");

function handleUserLeftEvent(data, emit) {
  try {
    // If a user left event was received, create a User object and emit a playerLeave event

    const user = new User(data.user.id, data.user.username);
    emit('playerLeave', user);
  } catch (error) {
    console.error("Error occurred while handling user leave event:", error);
    emit('error', error); // Emit the 'error' event with the error object
  }
}

module.exports = handleUserLeftEvent;
