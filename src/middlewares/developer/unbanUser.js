import { getUserMarkdownMention, getUser } from "../utils.js";

export default async (ctx) => {
  const [id, username] = getUser(ctx);

  const user = await ctx.getChatMember(id);
  const isUserBanned = user.status === "left" || user.status === "kicked";
  if (!isUserBanned) {
    return "Пользователь и так находится в чате";
  }

  await ctx.unbanChatMember(id);
  return `${getUserMarkdownMention(id, username)} разблокирован в чате`;
};
