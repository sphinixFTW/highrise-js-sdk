const { User } = require("../models");

function handleVoiceEvent(data, emit) {
  try {
    // Destructure the 'users' and 'seconds_left' properties from the data object
    const { users, seconds_left } = data;

    // Format the users data
    const formattedUsers = users.map(([userData, status]) => ({
      // Create a new User instance with the user ID and username
      user: new User(userData.id, userData.username),
      status: status
    }));

    // Emit the 'voiceChatCreate' event with the formatted users data and seconds_left
    emit('voiceChatCreate', formattedUsers, seconds_left);

  } catch (error) {
    console.error("Error occurred while handling voice chat event:", error);
    emit('error', error); // Emit the 'error' event with the error object
  }
}

module.exports = handleVoiceEvent;
