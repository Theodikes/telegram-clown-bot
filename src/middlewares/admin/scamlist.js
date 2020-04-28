const { getScammers, getUserMentionInMarkdownFormat } = require("../../utils");

module.exports = async (ctx) => {
  const scammers = getScammers();

  const formattedMarkdownMessage = `*Скамлист*: \n\n${scammers
    .map(({ id, username }) => getUserMentionInMarkdownFormat(id, username))
    .join("\n")}`;

  await ctx.replyWithMarkdown(formattedMarkdownMessage);
};
