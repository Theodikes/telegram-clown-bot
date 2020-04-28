const Telegraf = require("telegraf");
const { TOKEN } = require("./config");
const adminMiddleware = require("./middlewares/admin");
const memberMiddleware = require("./middlewares/member");
const developerMiddleware = require("./middlewares/developer");
const onlyMessagesAllowed = require("./middlewares/onlyMessages");
const provideInfo = require("./commands/help");

require("./database");

const bot = new Telegraf(TOKEN);

bot.command(["start", "help"], provideInfo);
bot.command(["unbanAll", "id"], developerMiddleware);

bot.use(onlyMessagesAllowed);
bot.use(memberMiddleware);
bot.use(adminMiddleware);

bot.startPolling();
