import Telegraf from "telegraf";
import { TOKEN } from "./config.js";
import {
  usersCommands,
  adminsCommands,
  developerCommands,
} from "./commands/index.js";
import {
  userMiddleware,
  adminMiddleware,
  developerMiddleware,
  bannedMiddleware,
  privateMiddleware,
  onlyMessagesAllowed,
} from "./middlewares/index.js";

import _ from "./database/index.js";

const bot = new Telegraf(TOKEN);

bot.use(onlyMessagesAllowed);
bot.use(bannedMiddleware);
bot.use(privateMiddleware);

bot.command(usersCommands, userMiddleware);
bot.command(developerCommands, developerMiddleware);
bot.command(adminsCommands, adminMiddleware);

bot.startPolling();
