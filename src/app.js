const Telegraf = require("telegraf");
const { TOKEN } = require("./config");
const adminMiddleware = require("./middlewares/admin");
const memberMiddleware = require("./middlewares/member");
const ignoreDeletedMessage = require("./middlewares/deletedMessage");

require("./database");

const bot = new Telegraf(TOKEN);

bot.use(ignoreDeletedMessage);
bot.use(adminMiddleware);
bot.use(memberMiddleware);

bot.startPolling();
