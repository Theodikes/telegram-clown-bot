const {
  isUserScammer,
  getUser,
  getUserID,
  isForwardedMessage,
  getCommand,
  loadAndSetScammers,
} = require("../../utils");
const userCtrl = require("../../controllers/user");

module.exports = async (ctx) => {
  const setUserAsScam = async (ctx) => {
    const [id, username] = getUser(ctx);

    if (!id) return "Укажите id скамера - это обязательный параметр.";
    if (isUserScammer(ctx)) {
      return "Пользователь уже в списке скамеров.";
    }

    await userCtrl.setAsScam(id, username);
    await userCtrl.ban(id, username);
    await loadAndSetScammers();
    await loadAndSetBannedUsers();

    return "Пользователь добавлен в список скамеров и забанен.";
  };

  const unsetUserAsScam = async (ctx) => {
    const id = getUserID(ctx);
    if (!id) return "Укажите id скамера - это обязательный параметр.";
    if (!isUserScammer(ctx)) {
      return "Пользователь ещё не добавлен в список скамеров.";
    }

    await userCtrl.unban(id);
    await userCtrl.unsetAsScam(id);
    await loadAndSetScammers();
    await loadAndSetBannedUsers();

    return "Пользователь удален из списка скамеров и разбанен.";
  };

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
