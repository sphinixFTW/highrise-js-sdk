class Ping {
    constructor(bot) {
        this.bot = bot;
        this.ping = null;
        this.start = null;
    }

    async get() {
        const start = Date.now();
        await this.bot.ws.ping();
        const end = Date.now();
        this.ping = end - start;
        this.start = Date.now();
        return this.ping;
    }

}

module.exports = { Ping };
