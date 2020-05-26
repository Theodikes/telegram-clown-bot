import {
  isSticker,
  isUserBanned,
  isStickerBanned,
  isAdmin,
  getSelf,
} from "../utils.js";

export const bannedMiddleware = async (ctx, next) => {
  if (isAdmin(getSelf(ctx))) {
    await next();
    return;
  }

  if (isUserBanned(getSelf(ctx))) {
    await ctx.deleteMessage();
    return;
  }

  if (isSticker(ctx) && isStickerBanned(ctx)) {
    await ctx.deleteMessage();
    return;
  }

  await next();
};
