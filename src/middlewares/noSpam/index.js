import {
  isChatAttacked,
  getLastDayJoined,
  updateLastDayJoined,
} from "../utils.js";
import { BOT } from "../../config.js";

import chatCtrl from "../../controllers/chat.js";

export const noSpam = async (ctx, next) => {
  if (isChatAttacked(ctx)) {
    if (ctx.updateSubTypes.includes("new_chat_members")) {
      try {
        await ctx.telegram.kickChatMember(
          ctx.chat.id,
          ctx.message.new_chat_member.id
        );
      } catch (e) {} //Возможно, другой бот успел кикнуть юзера до нас
    }

    try {
      await ctx.deleteMessage();
    } catch (e) {} // Возможно, другой бот успел удалить сообщение до нас

    return;
  }

  updateLastDayJoined(ctx);
  const lastDayJoined = getLastDayJoined(ctx);
  await chatCtrl.updateLastDayJoined(ctx.chat.id, lastDayJoined);

  if (ctx.updateSubTypes.includes("left_chat_member") && ctx.from.id == BOT) {
    await ctx.deleteMessage();
    return;
  }

  await next();
};
