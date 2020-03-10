const {
  isAdmin,
  isGroup,
  isSticker,
  isCommand,
  isForwardedMessage,
  getCommand,
  getBannedUsers
} = require("../utils");
const manageStickers = require("./sticker");
const manageAdministration = require("./admin");
const manageUsers = require("./ban");

module.exports = async (ctx, next) => {
  if (!isAdmin(ctx)) {
    await next();
    return;
  }
  if (!isGroup(ctx) && isSticker(ctx)) await manageStickers(ctx);
  if (isCommand(ctx)) {
    const command = getCommand(ctx);

    if (/.*clowns\b/i.test(command)) {
      const banned = getBannedUsers();

      const getUserMention = id => `- [${id}](tg://user?id=${id})`;
      const formattedMarkdownMessage = `*Список клоунов*: \n\n${banned
        .map(id => getUserMention(id))
        .join("\n")}`;

      ctx.replyWithMarkdown(formattedMarkdownMessage);
    }

    if (isForwardedMessage(ctx)) {
      if (/(set)|(delete)Admin\b/.test(command))
        await manageAdministration(ctx);
      if (/.*clown\b/.test(command)) await manageUsers(ctx);
    }
  }
};
