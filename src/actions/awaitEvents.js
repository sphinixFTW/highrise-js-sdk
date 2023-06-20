class AwaitEvents {
  constructor(bot) {
    this.bot = bot;
    this.messageListeners = new Map();
    this.reactionListeners = new Map();
    this.emoteListeners = new Map();
    this.tipsListeners = new Map();

    if (this.bot.eventTypesOfInterest.includes('messages')) {
      this.bot.on('chatMessageCreate', this.handleChatMessageCreate.bind(this));
      this.bot.on('whisperMessageCreate', this.handleChatMessageCreate.bind(this));
    }
    if (this.bot.eventTypesOfInterest.includes('reactionCreate')) {
      this.bot.on('reactionCreate', this.handleReactionCreate.bind(this));
    }
    if (this.bot.eventTypesOfInterest.includes('emoteCreate')) {
      this.bot.on('emoteCreate', this.handleEmoteCreate.bind(this));
    }
    if (this.bot.eventTypesOfInterest.includes('tipReactionCreate')) {
      this.bot.on('tipReactionCreate', this.handleTipsCreate.bind(this));
    }
  }

  handleChatMessageCreate(user, message) {
    // Notify all message listeners
    for (const listener of this.messageListeners.keys()) {
      listener(user, message);
    }
  }

  handleEmoteCreate(sender, receiver, emote) {
    // Notify all emotes listeners
    for (const listener of this.emoteListeners.keys()) {
      listener(sender, receiver, emote);
    }
  }

  handleReactionCreate(sender, receiver, reaction) {
    // Notify all reaction listeners
    for (const listener of this.reactionListeners.keys()) {
      listener(sender, receiver, reaction);
    }
  }

  handleTipsCreate(sender, receiver, item) {
    // Notify all tips listeners
    for (const listener of this.tipsListeners.keys()) {
      listener(sender, receiver, item);
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
      let uniqueUsers = new Set();

      const listener = (sender, receiver, reaction) => {
        if ((!filter || filter(sender, receiver, reaction)) && !uniqueUsers.has(sender.id)) {
          collected.push({ sender, receiver, reaction });
          uniqueUsers.add(sender.id);
        }

        if (max === true && collected.length >= uniqueUsers.size) {
          clearTimeout(timer);
          this.removeReactionListener(listener);
          resolve(collected);
        }
      };

      this.addReactionListener(listener);

      timer = setTimeout(() => {
        this.removeReactionListener(listener);
        resolve(collected);
      }, idle);
    });
  }

  awaitEmotes(options) {
    const { filter, max, idle } = options;

    return new Promise((resolve) => {
      let timer;
      let collected = [];
      let uniqueUsers = new Set();

      const listener = (sender, receiver, emote) => {
        if ((!filter || filter(sender, receiver, emote)) && !uniqueUsers.has(sender.id)) {
          collected.push({ sender, receiver, emote });
          uniqueUsers.add(sender.id);
        }

        if (max && collected.length >= max) {
          clearTimeout(timer);
          this.removeEmoteListener(listener);
          resolve(collected);
        }
      };

      this.addEmoteListener(listener);

      timer = setTimeout(() => {
        this.removeEmoteListener(listener);
        resolve(collected);
      }, idle);
    });
  }

  awaitTips(options) {
    const { filter, max, idle } = options;

    return new Promise((resolve) => {
      let timer;
      let collected = [];
      let uniqueUsers = new Set();

      const listener = (sender, receiver, item) => {
        if ((!filter || filter(sender, receiver, item)) && !uniqueUsers.has(sender.id)) {
          collected.push({ sender, receiver, item });
          uniqueUsers.add(sender.id);
        }

        if (max && collected.length >= max) {
          clearTimeout(timer);
          this.removeTipsListener(listener);
          resolve(collected);
        }
      };

      this.addTipsListener(listener);

      timer = setTimeout(() => {
        this.removeTipsListener(listener);
        resolve(collected);
      }, idle);
    });
  }

  addTipsListener(listener) {
    this.tipsListeners.set(listener, true);
  }

  removeTipsListener(listener) {
    this.tipsListeners.delete(listener);
  }

  addEmoteListener(listener) {
    this.emoteListeners.set(listener, true);
  }

  removeEmoteListener(listener) {
    this.emoteListeners.delete(listener);
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
