const {
  isAdmin,
  getSelf,
  isForwardedMessage,
  isGroup,
  isSticker,
} = require("../../utils");
const banStickers = require("./sticker");
const editScamlist = require("../admin/scam");
const scamHandler = require("../user/scam");

module.exports = async (ctx, next) => {
  if (isGroup(ctx)) {
    await next();
    return;
  }

  if (isAdmin(getSelf(ctx))) {
    if (isSticker(ctx)) await banStickers(ctx);
    if (isForwardedMessage(ctx)) await editScamlist(ctx);
  } else if (isForwardedMessage(ctx)) await scamHandler(ctx);
};
