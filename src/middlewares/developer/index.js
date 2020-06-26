import { OWNER } from "../../config.js";
import { getSelf, getLowerCaseCommand, getUser } from "../utils.js";
import unbanAll from "./unbanAll.js";
import addChat from "./addChat.js";
import setAttackState from "./underAttack.js";
import kickAllByTime from "./kickAllByTime.js";

export const developerMiddleware = async (ctx, next) => {
  if (getSelf(ctx) != OWNER) {
    return;
  }

  const command = getLowerCaseCommand(ctx);
  const getUserMention = (id, username) =>
    (username ? `@${username}` : `[${id}](tg://user?id=${id})`).replace(
      /_/g,
      "\\_"
    );
  const [id, username] = getUser(ctx);
  let message;

  switch (command) {
    case "unbanall":
      message = await unbanAll();
      break;

    case "info":
      message = `ID: ${
        id || "неизвестно. Вы не переслали сообщение."
      }\nUsername: @${username}`;
      break;

    case "addchat":
      message = await addChat(ctx);
      break;

    case "underattack":
      message = await setAttackState(ctx);
      break;

    case "kickall":
      message = await kickAllByTime(ctx);
      break;

    case "ban":
      try {
        await ctx.kickChatMember(id);
        message = `${getUserMention(id, username)} удален из чата`;
      } catch (err) {
        message =
          err.code === 400
            ? "Невозможно заблокировать администратора чата"
            : "Неизвестная ошибка";
      }

      break;

    case "unban":
      const user = await ctx.getChatMember(id);
      const isUserBanned = user.status === "left" || user.status === "kicked";
      if (isUserBanned) {
        await ctx.unbanChatMember(id);
        message = `${getUserMention(id, username)} разблокирован в чате`;
      } else {
        message = "Пользователь и так находится в чате";
      }

      break;
  }

  await ctx.replyWithMarkdown(message);

  await next();
};
