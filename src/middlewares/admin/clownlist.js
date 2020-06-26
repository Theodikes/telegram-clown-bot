import { getBannedUsers, getFullUserMarkdownMention } from "../utils.js";

export default async (ctx) => {
  const banned = getBannedUsers();

  const formattedMarkdownMessage = `*Список клоунов*: \n\n${banned
    .map(({ id, username }) => getFullUserMarkdownMention(id, username))
    .join("\n")}`;

  await ctx.replyWithMarkdown(formattedMarkdownMessage);
};
