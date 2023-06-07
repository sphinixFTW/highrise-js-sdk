const { User, AnchorPosition, Position } = require("../models");

function handleMovementEvent(data, emit) {
  try {
    // If a user moved event was received, create a User object and extract the position data.
    // Depending on the type of position data received, emit a TrackPlayerMovement event for the user

    const user = new User(data.user.id, data.user.username);
    if ('x' in data.position && 'y' in data.position && 'z' in data.position) {
      const destination = new Position(data.position.x, data.position.y, data.position.z, data.position.facing);
      emit('trackPlayerMovement', user, destination);
    } else if ('entity_id' in data.position && 'anchor_ix' in data.position) {
      const anchor = new AnchorPosition(data.position.entity_id, data.position.anchor_ix);
      emit('trackPlayerMovement', user, anchor);
    }
  } catch (error) {
    console.error("Error occurred while handling track player movement event:", error);
    emit('error', error); // Emit the 'error' event with the error object
  }
}

module.exports = handleMovementEvent;
