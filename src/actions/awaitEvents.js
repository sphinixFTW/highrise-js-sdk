class AwaitEvents {
  constructor(bot) {
    this.bot = bot;
    this.messageListeners = new Map();
    this.reactionListeners = new Map();
    this.bot.on('chatMessageCreate', this.handleChatMessageCreate.bind(this));
    this.bot.on('whisperMessageCreate', this.handleChatMessageCreate.bind(this));
    this.bot.on('reactionCreate', this.handleReactionCreate.bind(this));
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

      const listener = (user, message) => {
        if (!filter || filter(user)) {
          collected.push({ user, message });

          if (collected.length >= max) {
            clearTimeout(timer);
            this.removeMessageListener(listener);
            resolve(collected);
          }
        }
      };

      this.addMessageListener(listener);

      timer = setTimeout(() => {
        this.removeMessageListener(listener);
        resolve([]); // Return an empty array to indicate no matching messages
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
            this.removeMessageListener(listener);
            resolve(collected);
          }
        }
      };

      this.addReactionListener(listener);

      timer = setTimeout(() => {
        this.removereactionListener(listener);
        resolve([]); // Return an empty array to indicate no matching reactions
      }, idle);
    });
  }

  addReactionListener(listener) {
    this.reactionListeners.set(listener, true)
  }

  removereactionListener(listener) {
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
