import userCtrl from "../../controllers/user.js";
import { getBannedUsers, loadAndSetBannedUsers } from "../utils.js";

export default async () => {
  const banned = getBannedUsers();

  try {
    for (const { id } of banned) {
      await userCtrl.unban(id);
      await loadAndSetBannedUsers();
    }

    return "Цирк больше не финансируется, весь клоунский коллектив распущен";
  } catch (error) {
    console.error(error);
    return "Ошибка с доступом к базе данных";
  }
};
