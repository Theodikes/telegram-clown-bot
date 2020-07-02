import { OWNER } from "../../config.js";
import { getSelf, getLowerCaseCommand, getUser } from "../utils.js";
import unclownAll from "./unclownAll.js";
import addChat from "./addChat.js";
import setAttackState from "./underAttack.js";
import kickAllByTime from "./kickAllByTime.js";
import banUser from "./banUser.js";
import unbanUser from "./unbanUser.js";
import restrictUser from "./restrictUser.js";

export const developerMiddleware = async (ctx, next) => {
  if (getSelf(ctx) != OWNER) {
    return;
  }

  const command = getLowerCaseCommand(ctx);
  let message;

  switch (command) {
    case "unclownall":
      message = await unclownAll();
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
      message = await banUser(ctx);
      break;

    case "unban":
      message = await unbanUser(ctx);
      break;

    case "restrict":
      message = await restrictUser(ctx);
      break;
  }

  await ctx.replyWithMarkdown(message);

  await next();
};
