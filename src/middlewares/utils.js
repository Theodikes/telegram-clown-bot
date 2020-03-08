const stickersCtrl = require("../controllers/sticker");
const adminCtrl = require("../controllers/admin");
const userCtrl = require("../controllers/user");
const { OWNER } = require("./config");

const getStickerId = ctx => ctx.message.sticker.file_unique_id;
const getUserIDByReply = ctx => ctx.message.reply_to_message.from.id;
const getUsernameByReply = ctx => ctx.message.reply_to_message.from.username;
const getCommand = ctx => ctx.message.text.split(" ")[0];
const getForwardedMessage = ctx => ctx.message.reply_to_message;

let admins = [];
const loadAndSetAdmins = async () => (admins = await adminCtrl.getAll());
loadAndSetAdmins();

const addAdmin = async ctx => {
  if (isAdmin(getForwardedMessage(ctx)))
    return "Данный пользователь уже является администратором.";

  await adminCtrl.add(getUserIDByReply(ctx), getUsernameByReply(ctx));
  loadAndSetAdmins();

  return "Админ добавлен";
};

const deleteAdmin = async ctx => {
  if (getUserIDByReply(ctx) == OWNER)
    return "Невозможно снять полномочия админа с овнера.";

  await adminCtrl.remove(getUserIDByReply(ctx));
  loadAndSetAdmins();

  return "Админ удален";
};

let bannedUsers = [];
const loadAndSetBannedUsers = async () =>
  (bannedUsers = await userCtrl.getBanned());
loadAndSetBannedUsers();

const banUser = async ctx => {
  if (isAdmin(getForwardedMessage(ctx)))
    return "Невозможно удалить сообщения администратора.";
  if (isUserBanned(getForwardedMessage(ctx)))
    return "Извините, но он уже выступает в цирке";

  await userCtrl.ban(getUserIDByReply(ctx), getUsernameByReply(ctx));
  await loadAndSetBannedUsers();

  return "Назначен новый клоун";
};

const unbanUser = async ctx => {
  if (!isUserBanned(getForwardedMessage(ctx)))
    return "Пока еще в цирке не выступает, сначала наденьте ему маску клоуна";

  await userCtrl.unban(getUserIDByReply(ctx));
  await loadAndSetBannedUsers();

  return "Поздравляю, маска клоуна снята!";
};

let bannedStickers = [];
const loadAndSetBannedStickers = async () =>
  (bannedStickers = await stickersCtrl.getAll());
loadAndSetBannedStickers();

const banSticker = async ctx => {
  await stickersCtrl.add(getStickerId(ctx));
  await loadAndSetBannedStickers();

  return "Стикер заблокирован в чате";
};

const unbanSticker = async ctx => {
  await stickersCtrl.remove(getStickerId(ctx));
  await loadAndSetBannedStickers();

  return "Стикер разблокирован в чате";
};

const isAdmin = ctx => admins.includes(ctx.from.id);
const isCommand = ctx =>
  ctx.message.text &&
  ctx.message.text.startsWith("/") &&
  ctx.message.entities &&
  ctx.message.entities[0].type === "bot_command";
const isGroup = ctx => ctx.chat.type !== "private";
const isSticker = ctx => ctx.message && ctx.message.sticker;
const isStickerBanned = ctx => bannedStickers.includes(getStickerId(ctx));
const isUserBanned = ctx => bannedUsers.includes(ctx.from.id);
const isForwardedMessage = ctx => ctx.message.reply_to_message;

module.exports = {
  isGroup,
  isSticker,
  isStickerBanned,
  isUserBanned,
  banSticker,
  unbanSticker,
  banUser,
  unbanUser,
  addAdmin,
  deleteAdmin,
  isAdmin,
  isCommand,
  getCommand,
  isForwardedMessage
};
