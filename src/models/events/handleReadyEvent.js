const { SessionMetadata } = require("../models");
const packageJson = require('../../../package.json');

function handleReadyEvent(data, emit) {
  try {

    // Emit the 'ready' event with sessionMetadata
    const currentVersion = packageJson.version;
    const sessionMetadata = new SessionMetadata(
      data.user_id,
      data.room_info,
      data.rate_limits,
      data.connection_id,
      currentVersion
    );

    emit('ready', sessionMetadata);
  } catch (error) {
    console.error("Error occurred while handling ready event:", error);
    emit('error', error); // Emit the 'error' event with the error object
  }
}

module.exports = handleReadyEvent;
