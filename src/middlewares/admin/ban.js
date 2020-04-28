const {
  isAdmin,
  loadAndSetBannedUsers,
  isUserBanned,
  getCommand,
  getUser,
  getUserID,
} = require("../../utils");
const userCtrl = require("../../controllers/user");

module.exports = async (ctx) => {
  const banUser = async (ctx) => {
    const [id, username] = getUser(ctx);

    if (!id) return "Не указан идентификатор клоуна для назначения в цирк";
    if (isAdmin(id)) return "Невозможно сделать клоуном администратора.";
    if (isUserBanned(id)) return "Извините, но он уже выступает в цирке";

    await userCtrl.ban(id, username);
    await loadAndSetBannedUsers();

    return "Назначен новый клоун";
  };

  const unbanUser = async (ctx) => {
    const id = getUserID(ctx);

    if (!id) return "Не указан идентификатор клоуна";
    if (!isUserBanned(id))
      return "Пока еще в цирке не выступает, сначала наденьте ему маску клоуна";

    await userCtrl.unban(id);
    await loadAndSetBannedUsers();

    return "Поздравляю, маска клоуна снята!";
  };

  const result =
    getCommand(ctx) === "/clown" ? await banUser(ctx) : await unbanUser(ctx);

  await ctx.reply(result);
};
