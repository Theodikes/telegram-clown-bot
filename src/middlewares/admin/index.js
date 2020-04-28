const {
  isAdmin,
  isGroup,
  isSticker,
  isCommand,
  isForwardedMessage,
  isReplyedMessage,
  getCommand,
  getBannedUsers,
  getScammers,
  getSelf,
} = require("../../utils");
const banStickers = require("./sticker");
const manageAdministration = require("./admin");
const editBanlist = require("./ban");
const editScamlist = require("./scam");

module.exports = async (ctx, next) => {
  if (!isAdmin(getSelf(ctx))) {
    return;
  }

  if (!isGroup(ctx)) {
    if (isSticker(ctx)) await banStickers(ctx);
    if (isForwardedMessage(ctx)) await editScamlist(ctx);
  }

  if (isCommand(ctx)) {
    const command = getCommand(ctx);
    const getUserMention = (id, username = "") =>
      `- [${id}](tg://user?id=${id}): @${username || "null"}`;

    if (/.*clowns\b/i.test(command)) {
      const banned = getBannedUsers();

      const formattedMarkdownMessage = `*Список клоунов*: \n\n${banned
        .map(({ id, username }) => getUserMention(id, username))
        .join("\n")}`;

      ctx.replyWithMarkdown(formattedMarkdownMessage);
    } else if (/.*(scammers)|(scamlist)\b/i.test(command)) {
      const scammers = getScammers();

      const formattedMarkdownMessage = `*Скамлист*: \n\n${scammers
        .map(({ id, username }) => getUserMention(id, username))
        .join("\n")}`;

      ctx.replyWithMarkdown(formattedMarkdownMessage);
    } else if (/.*scam\b/.test(command)) await editScamlist(ctx);
    else if (/.*clown\b/.test(command)) await editBanlist(ctx);
    else if (/(set)|(delete)Admin\b/.test(command))
      await manageAdministration(ctx);
  }

  await next();
};
