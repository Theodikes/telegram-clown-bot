import { getBannedUsers, getUserMentionInMarkdownFormat } from "../utils.js";

export default async (ctx) => {
  const banned = getBannedUsers();

  const formattedMarkdownMessage = `*Список клоунов*: \n\n${banned
    .map(({ id, username }) => getUserMentionInMarkdownFormat(id, username))
    .join("\n")}`;

  await ctx.replyWithMarkdown(formattedMarkdownMessage);
};
