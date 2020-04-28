const Telegraf = require("telegraf");
const { TOKEN } = require("./config");
const userMiddleware = require("./middlewares/user");
const adminMiddleware = require("./middlewares/admin");
const privateForwardMiddleware = require("./middlewares/forward");
const bannedMiddleware = require("./middlewares/banned");
const developerMiddleware = require("./middlewares/developer");
const onlyMessagesAllowed = require("./middlewares/onlyMessages");
const {
  usersCommands,
  adminsCommands,
  developerCommands,
} = require("./commands");

require("./database");

const bot = new Telegraf(TOKEN);

bot.use(onlyMessagesAllowed);
bot.use(bannedMiddleware);
bot.use(privateForwardMiddleware);

bot.command(usersCommands, userMiddleware);
bot.command(developerCommands, developerMiddleware);
bot.command(adminsCommands, adminMiddleware);

bot.startPolling();
