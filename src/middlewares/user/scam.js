const {
  isUserKnownByBot,
  isUserScammer,
  isForwardedMessage,
} = require("../../utils");

module.exports = async (ctx) => {
  const unknown =
    "Этого юзера нет в списке известных боту (технические причины). Работайте с ним на свой страх и риск.";
  const scam = "Этот пользователь - скамер. Не ведите с ним дел!";
  const noscam = "Этого юзера нет в скам-листе.";

  if (isForwardedMessage(ctx) && !isUserKnownByBot(ctx)) {
    ctx.reply(unknown);
    return;
  }

  if (isUserScammer(ctx)) {
    ctx.reply(scam);
  } else {
    ctx.reply(noscam);
  }
};
