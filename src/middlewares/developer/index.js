import { OWNER } from "../../config.js";
import { getSelf, getLowerCaseCommand, getUser } from "../utils.js";
import unbanAll from "./unbanAll.js";

export default async (ctx, next) => {
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
  }

  await ctx.reply(message);

  await next();
};
