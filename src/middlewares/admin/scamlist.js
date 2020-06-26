import { getScammers, getFullUserMarkdownMention } from "../utils.js";

export default async (ctx) => {
  const scammers = getScammers();

  const formattedMarkdownMessage = `*Скамлист*: \n\n${scammers
    .map(({ id, username }) => getFullUserMarkdownMention(id, username))
    .join("\n")}`;

  await ctx.replyWithMarkdown(formattedMarkdownMessage);
};
