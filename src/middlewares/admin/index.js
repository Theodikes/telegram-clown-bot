const {
  isAdmin,
  isGroup,
  isSticker,
  isCommand,
  getCommand,
  isForwardedMessage
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
  if (isCommand(ctx) && isForwardedMessage(ctx)) {
    if (/(set)|(delete)Admin/.test(getCommand(ctx)))
      await manageAdministration(ctx);
    if (/.*clown/.test(getCommand(ctx))) await manageUsers(ctx);
  }
};
