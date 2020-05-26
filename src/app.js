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
  noSpam,
} from "./middlewares/index.js";

import _ from "./database/index.js";

const bot = new Telegraf(TOKEN);

bot.on(["new_chat_members", "left_chat_member"], noSpam);

bot.use(onlyMessagesAllowed);
bot.use(bannedMiddleware);
bot.use(privateMiddleware);

bot.command(usersCommands, userMiddleware);
bot.command(developerCommands, developerMiddleware);
bot.command(adminsCommands, adminMiddleware);

bot.startPolling();
