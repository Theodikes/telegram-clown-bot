import { loadAndSetChats } from "../utils.js";
import chatCtrl from "../../controllers/chat.js";

export default async (ctx) => {
  try {
    await chatCtrl.add(ctx.chat.id, ctx.chat.title);
    ctx.reply("Чат добавлен в базу данных");
  } catch (err) {
    ctx.reply(err.message);
  }

  loadAndSetChats();
};
