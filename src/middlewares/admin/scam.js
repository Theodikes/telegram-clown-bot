const {
  isUserScammer,
  setUserAsScam,
  unsetUserAsScam,
  isForwardedMessage,
  getCommand,
} = require("../../utils");

module.exports = async (ctx) => {
  let message = "";
  if (isForwardedMessage(ctx)) {
    message = isUserScammer(ctx)
      ? await unsetUserAsScam(ctx)
      : await setUserAsScam(ctx);
    await ctx.reply(message);

    return;
  }

  message =
    getCommand(ctx) === "/scam"
      ? await setUserAsScam(ctx)
      : await unsetUserAsScam(ctx);
  await ctx.reply(message);
};
