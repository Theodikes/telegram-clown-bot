import { getUser } from "../utils.js";

export default async (ctx) => {
  const [id, username] = getUser(ctx);
  const message = `ID: ${
    id || "неизвестно. Вы не переслали сообщение."
  }\nUsername: @${username.replace(/_/g, "\\_")}`;

  await ctx.replyWithMarkdown(message);
};
