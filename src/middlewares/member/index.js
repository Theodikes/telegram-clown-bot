const { isGroup, isAdmin, isSticker, isUserBanned } = require("../utils");
const stickerHandler = require("./sticker");

module.exports = async (ctx, next) => {
  if (!isGroup(ctx) || isAdmin(ctx)) return;

  if (isUserBanned(ctx)) {
    await ctx.deleteMessage();
    return;
  }
  if (isSticker(ctx)) await stickerHandler(ctx);

  await next();
};
