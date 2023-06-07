const { User, CurrencyItem } = require("../models");

function handleTipsEvent(data, emit) {
  try {
    // If a tip reaction event was received, create User objects for the sender and receiver,
    // and emit a tipReactionCreate event for the sender, receiver, and item

    const sender = new User(data.sender.id, data.sender.username);
    const receiver = new User(data.receiver.id, data.receiver.username)
    const item = new CurrencyItem(data.item.type, data.item.amount);

    emit('tipReactionCreate', sender, receiver, item);
  } catch (error) {
    console.error("Error occurred while handling tips event:", error);
    emit('error', error); // Emit the 'error' event with the error object
  }
}

module.exports = handleTipsEvent;
