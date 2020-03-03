const { isStickerBanned } = require("../utils");

module.exports = async ctx => {
  if (isStickerBanned(ctx)) await ctx.deleteMessage();
};
