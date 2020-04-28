const { OWNER } = require("../../config");
const { getSelf, isCommand, getCommand, getUserID } = require("../../utils");
const unbanAll = require("./unbanAll");

module.exports = async (ctx, next) => {
  if (getSelf(ctx) != OWNER) {
    return;
  }

  const command = getCommand(ctx);
  let message;

  switch (command) {
    case "/unbanAll":
      message = await unbanAll();
      break;
    case "/id":
      message = `ID пользователя: \`\`\`${getUserID(ctx)}\`\`\``;
  }

  await ctx.replyWithMarkdown(message);

  await next();
};
