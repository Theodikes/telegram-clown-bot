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
  let message;

  switch (command) {
    case "unbanall":
      message = await unbanAll();
      break;

    case "info":
      const [id, username] = getUser(ctx);
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
  }

  await ctx.replyWithMarkdown(message);

  await next();
};
