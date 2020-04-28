const userCtrl = require("../../controllers/user");
const { getBannedUsers, loadAndSetBannedUsers } = require("../../utils");

module.exports = async () => {
  const banned = getBannedUsers();

  try {
    for (const { id } of banned) {
      await userCtrl.unban(id);
      await loadAndSetBannedUsers();
    }

    return "Банлист полностью очищен.";
  } catch (error) {
    console.error(error);
    return "Ошибка с доступом к базе данных";
  }
};
