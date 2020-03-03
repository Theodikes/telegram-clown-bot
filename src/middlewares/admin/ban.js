const { banUser, unbanUser, getCommand } = require("../utils");

module.exports = async ctx => {
  const result =
    getCommand(ctx) === "/clown" ? await banUser(ctx) : await unbanUser(ctx);

  await ctx.reply(result);
};
