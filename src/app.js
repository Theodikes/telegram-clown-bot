const Telegraf = require("telegraf");
const { TOKEN } = require("./config");
const adminMiddleware = require("./middlewares/admin");
const memberMiddleware = require("./middlewares/member");
const onlyMessagesAllowed = require("./middlewares/onlyMessages");

require("./database");

const bot = new Telegraf(TOKEN);

bot.use(onlyMessagesAllowed);
bot.use(adminMiddleware);
bot.use(memberMiddleware);

bot.startPolling();
