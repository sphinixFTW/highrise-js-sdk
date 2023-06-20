function handleDMEvent(data, emit) {
  try {

    const conversation = {
      id: data.conversation_id,
      isNew: data.is_new_conversation
    };

    emit('directMessageCreate', data.user_id, conversation);

  } catch (error) {
    console.error("Error occurred while handling chat event:", error);
    emit('error', error); // Emit the 'error' event with the error object
  }
}

module.exports = handleDMEvent;