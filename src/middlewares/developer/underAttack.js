import chatCtrl from "../../controllers/chat.js";
import { loadAndSetChats } from "../utils.js";

export default async (ctx) => {
  const parameter = ctx.message.text.split(" ")[1];
  const attacked = ["start", "1", undefined].includes(parameter);

  try {
    await chatCtrl.setAttackState(ctx.chat.id, attacked);

    loadAndSetChats();
    return attacked
      ? "Чат атакован. Все зашедшие пользователи будут моментально блокироваться, сообщения о входе и выходе из чата показываться не будут."
      : "Атака на чат закончилась, режим удаления новых пользователей выключен.";
  } catch (err) {
    return "Нет доступа к базе данных.";
  }
};
