import {
  isAdmin,
  getSelf,
  isForwardedMessage,
  isGroup,
  isSticker,
} from "../utils.js";
import banStickers from "./sticker.js";
import editScamlist from "../admin/scam.js";
import scamHandler from "../user/scam.js";

export default async (ctx, next) => {
  if (isGroup(ctx)) {
    await next();
    return;
  }

  if (isAdmin(getSelf(ctx))) {
    if (isSticker(ctx)) await banStickers(ctx);
    if (isForwardedMessage(ctx)) await editScamlist(ctx);
  } else if (isForwardedMessage(ctx)) await scamHandler(ctx);

  await next();
};
