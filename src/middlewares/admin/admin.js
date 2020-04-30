import {
  getUserID,
  getUser,
  isAdmin,
  loadAndSetAdmins,
  getLowerCaseCommand,
} from "../utils.js";
import adminCtrl from "../../controllers/admin.js";
import { OWNER } from "../../config.js";

export default async (ctx) => {
  const addAdmin = async (ctx) => {
    const [id, username] = getUser(ctx);
    if (!id) "Не указан id администратора";
    if (isAdmin(id)) return "Данный пользователь уже является администратором.";

    await adminCtrl.add(id, username);
    loadAndSetAdmins();

    return "Админ добавлен";
  };

  const deleteAdmin = async (ctx) => {
    const id = getUserID(ctx);

    if (!id) "Не указан id администратора";
    if (id == OWNER) return "Невозможно снять полномочия админа с овнера.";

    await adminCtrl.remove(id);
    loadAndSetAdmins();

    return "Админ удален";
  };

  try {
    const result =
      getLowerCaseCommand(ctx) === "setadmin"
        ? await addAdmin(ctx)
        : await deleteAdmin(ctx);

    await ctx.replyWithMarkdown(`${result}`);
  } catch (err) {
    console.log(err);
    await ctx.replyWithMarkdown(err.message);
  }
};
