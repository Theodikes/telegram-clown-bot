const {
  isGroup,
  isSticker,
  isUserBanned,
  isForwardedMessage,
  isAdmin,
  isCommand,
  getCommand,
  getSelf,
} = require("../../utils");
const stickerHandler = require("./sticker");
const scamHandler = require("./scam");

module.exports = async (ctx, next) => {
  if (isAdmin(getSelf(ctx))) {
    await next();
    return;
  }

  if (isUserBanned(getSelf(ctx))) {
    await ctx.deleteMessage();
    return;
  }

  if (isCommand(ctx)) {
    const command = getCommand(ctx);

    if (/isscam\b/i.test(command)) return await scamHandler(ctx);
  }

  if (!isGroup(ctx)) {
    if (isForwardedMessage(ctx)) {
      await scamHandler(ctx);
    }

    return;
  }

  if (isSticker(ctx)) await stickerHandler(ctx);

  await next();
};
