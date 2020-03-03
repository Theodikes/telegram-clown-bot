const {
  isGroup,
  isSticker,
  isStickerBanned,
  unbanSticker,
  banSticker
} = require("../utils");

module.exports = async ctx => {
  const result = isStickerBanned(ctx)
    ? await unbanSticker(ctx)
    : await banSticker(ctx);

  await ctx.reply(result);
};
