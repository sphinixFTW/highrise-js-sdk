class AwaitEvents {
  constructor(bot) {
    this.bot = bot;
    this.messageListeners = new Map();
    this.reactionListeners = new Map();
    if (this.bot.eventTypesOfInterest.includes('messages')) {
      this.bot.on('chatMessageCreate', this.handleChatMessageCreate.bind(this));
      this.bot.on('whisperMessageCreate', this.handleChatMessageCreate.bind(this));
    }
    if (this.bot.eventTypesOfInterest.includes('reactionCreate')) {
      this.bot.on('reactionCreate', this.handleReactionCreate.bind(this));
    }
  }

  handleChatMessageCreate(user, message) {
    // Notify all message listeners
    for (const listener of this.messageListeners.keys()) {
      listener(user, message);
    }
  }

  handleReactionCreate(sender, receiver, reaction) {
    // Notify all reaction listeners
    for (const listener of this.reactionListeners.keys()) {
      listener(sender, receiver, reaction);
    }
  }

  awaitMessages(options) {
    const { filter, max, idle } = options;

    return new Promise((resolve) => {
      let timer;
      let collected = [];
      let uniqueUsers = new Set();

      const listener = (user, message) => {
        if ((!filter || filter(user, message)) && !uniqueUsers.has(user.id)) {
          collected.push({ user, message });
          uniqueUsers.add(user.id);
        }

        if (max && collected.length >= max) {
          clearTimeout(timer);
          this.removeMessageListener(listener);
          resolve(collected);
        }
      };

      this.addMessageListener(listener);

      timer = setTimeout(() => {
        this.removeMessageListener(listener);
        resolve(collected);
      }, idle);
    });
  }

  awaitReactions(options) {
    const { filter, max, idle } = options;

    return new Promise((resolve) => {
      let timer;
      let collected = [];

      const listener = (sender, receiver, reaction) => {
        if (!filter || filter(sender, receiver, reaction)) {
          collected.push({ sender, receiver, reaction });

          if (collected.length >= max) {
            clearTimeout(timer);
            this.removeReactionListener(listener);
            resolve(collected);
          }
        }
      };

      this.addReactionListener(listener);

      timer = setTimeout(() => {
        this.removeReactionListener(listener);
        resolve([]); // Return an empty array to indicate no matching reactions
      }, idle);
    });
  }

  addReactionListener(listener) {
    this.reactionListeners.set(listener, true);
  }

  removeReactionListener(listener) {
    this.reactionListeners.delete(listener);
  }

  addMessageListener(listener) {
    this.messageListeners.set(listener, true);
  }

  removeMessageListener(listener) {
    this.messageListeners.delete(listener);
  }
}

module.exports = { AwaitEvents };
