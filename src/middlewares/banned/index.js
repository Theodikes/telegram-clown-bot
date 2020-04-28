const {
  isGroup,
  isSticker,
  isUserBanned,
  isForwardedMessage,
  isAdmin,
  getSelf,
} = require("../../utils");
const stickerHandler = require("./sticker");

module.exports = async (ctx, next) => {
  if (isAdmin(getSelf(ctx))) {
    await next();
    return;
  }

  if (isUserBanned(getSelf(ctx))) {
    await ctx.deleteMessage();
    return;
  }

  if (isSticker(ctx)) await stickerHandler(ctx);

  await next();
};
