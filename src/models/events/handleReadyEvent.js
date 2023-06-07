const { SessionMetadata } = require("../models");
const packageJson = require('../../../package.json');
const { execSync } = require('child_process');

function handleReadyEvent(data, emit) {
  try {
    // Emit the 'ready' event with sessionMetadata

    const currentVersion = packageJson.version;
    const latestVersion = execSync('npm view highrise-js-sdk version').toString().trim();

    if (currentVersion !== latestVersion) {
      console.warn(`[WARNING]:`.red + ` You are using version ` + `${currentVersion}`.yellow + ` of highrise-js-sdk. The latest version is ` + `${latestVersion}`.green + ` Consider updating by running ` + `npm install highrise-js-sdk@latest`.green);
    }

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
