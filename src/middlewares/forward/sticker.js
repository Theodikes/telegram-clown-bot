import {
  isStickerBanned,
  getStickerId,
  loadAndSetBannedStickers,
} from "../utils.js";
import stickersCtrl from "../../controllers/sticker.js";

export default async (ctx) => {
  const banSticker = async (ctx) => {
    await stickersCtrl.add(getStickerId(ctx));
    await loadAndSetBannedStickers();

    return "Стикер заблокирован в чате";
  };

  const unbanSticker = async (ctx) => {
    await stickersCtrl.remove(getStickerId(ctx));
    await loadAndSetBannedStickers();

    return "Стикер разблокирован в чате";
  };

  const result = isStickerBanned(ctx)
    ? await unbanSticker(ctx)
    : await banSticker(ctx);

  await ctx.reply(result);
};
