const { addAdmin, deleteAdmin, getCommand } = require("../utils");

module.exports = async ctx => {
  try {
    const result =
      getCommand(ctx) === "/setAdmin"
        ? await addAdmin(ctx)
        : await deleteAdmin(ctx);

    await ctx.replyWithMarkdown(`${result}`);
  } catch (err) {
    console.log(err);
    await ctx.replyWithMarkdown(err.message);
  }
};
