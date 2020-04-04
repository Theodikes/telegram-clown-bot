const stickersCtrl = require("./controllers/sticker");
const adminCtrl = require("./controllers/admin");
const userCtrl = require("./controllers/user");
const { OWNER } = require("./config");

const getStickerId = (ctx) => ctx.message.sticker.file_unique_id;
const getUserID = (ctx) => {
  if (isReplyedMessage(ctx)) return ctx.message.reply_to_message.from.id;
  if (isForwardedMessage(ctx))
    return isUserKnownByBot(ctx) ? ctx.message.forward_from.id : undefined;
  if (isMention(ctx)) return parseInt(ctx.message.text.split(" ")[1] || 0, 10);

  return ctx.from.id;
};
const getUsername = (ctx) => {
  if (isReplyedMessage(ctx)) return ctx.message.reply_to_message.from.username;
  if (isForwardedMessage(ctx))
    return isUserKnownByBot(ctx)
      ? ctx.message.forward_from.username
      : undefined;
  if (isMention(ctx)) {
    const { offset, length } = ctx.message.entities.find(
      (ent) => ent.type === "mention"
    );

    return ctx.message.text.slice(offset + 1, offset + length);
  }

  return ctx.from.username;
};
const getUser = (ctx) => [getUserID(ctx), getUsername(ctx)];
const getCommand = (ctx) => {
  const { offset, length } = ctx.message.entities.find(
    (ent) => ent.type === "bot_command"
  );

  return ctx.message.text.slice(offset, offset + length);
};
const getReplyedMessage = (ctx) => ctx.message.reply_to_message;
const getBannedUsers = () => bannedUsers;
const getScammers = () => scammers;

let admins = [];
const loadAndSetAdmins = async () => (admins = await adminCtrl.getAll());
loadAndSetAdmins();

const addAdmin = async (ctx) => {
  const [id, username] = getUser(ctx);
  if (isAdmin(getReplyedMessage(ctx)))
    return "Данный пользователь уже является администратором.";

  await adminCtrl.add(id, username);
  loadAndSetAdmins();

  return "Админ добавлен";
};

const deleteAdmin = async (ctx) => {
  if (getUserID(ctx) == OWNER)
    return "Невозможно снять полномочия админа с овнера.";

  await adminCtrl.remove(getUserID(ctx));
  loadAndSetAdmins();

  return "Админ удален";
};

let bannedUsers = [];
const loadAndSetBannedUsers = async () =>
  (bannedUsers = await userCtrl.getBanned());
loadAndSetBannedUsers();

const banUser = async (ctx) => {
  if (isAdmin(getReplyedMessage(ctx)))
    return "Невозможно сделать клоуном администратора.";
  if (isUserBanned(getReplyedMessage(ctx)))
    return "Извините, но он уже выступает в цирке";

  await userCtrl.ban(...getUser(ctx));
  await loadAndSetBannedUsers();

  return "Назначен новый клоун";
};

const unbanUser = async (ctx) => {
  if (!isUserBanned(getReplyedMessage(ctx)))
    return "Пока еще в цирке не выступает, сначала наденьте ему маску клоуна";

  await userCtrl.unban(getUserID(ctx));
  await loadAndSetBannedUsers();

  return "Поздравляю, маска клоуна снята!";
};

let scammers = [];
const loadAndSetScammers = async () =>
  (scammers = await userCtrl.getScammers());
loadAndSetScammers();

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

let bannedStickers = [];
const loadAndSetBannedStickers = async () =>
  (bannedStickers = await stickersCtrl.getAll());
loadAndSetBannedStickers();

const banSticker = async (ctx) => {
  await stickersCtrl.add(getStickerId(ctx));
  await loadAndSetBannedStickers();

  return "Стикер заблокирован в чате";
};

const unbanSticker = async (ctx) => {
  await stickersCtrl.remove(getStickerId(ctx));
  await loadAndSetBannedStickers();

  return "Стикер разблокирован в чате";
};

const isAdmin = (ctx) => admins.includes(ctx.from.id);
const isCommand = (ctx) =>
  ctx.message.text &&
  ctx.message.text.startsWith("/") &&
  ctx.message.entities &&
  ctx.message.entities[0].type === "bot_command";
const isGroup = (ctx) => ctx.chat.type !== "private";
const isSticker = (ctx) => ctx.updateSubTypes.includes("sticker");
const isStickerBanned = (ctx) => bannedStickers.includes(getStickerId(ctx));
const isUserBanned = (ctx) =>
  bannedUsers.map((user) => user.id).includes(ctx.from.id);
const isUserScammer = (ctx) => {
  const [id, username] = getUser(ctx);

  return (
    scammers.map((user) => user.id).includes(id) ||
    scammers.map((user) => user.username).includes(username)
  );
};
const isReplyedMessage = (ctx) => ctx.message.reply_to_message;
const isForwardedMessage = (ctx) => ctx.updateSubTypes.includes("forward");
const isUserKnownByBot = (ctx) => ctx.message.forward_from;
const isMention = (ctx) =>
  ctx.message.entities &&
  ctx.message.entities.some((el) => el.type === "mention");

module.exports = {
  isGroup,
  isSticker,
  isStickerBanned,
  isUserBanned,
  banSticker,
  unbanSticker,
  banUser,
  unbanUser,
  setUserAsScam,
  unsetUserAsScam,
  addAdmin,
  deleteAdmin,
  isAdmin,
  isCommand,
  getCommand,
  isReplyedMessage,
  getBannedUsers,
  getScammers,
  isForwardedMessage,
  isUserKnownByBot,
  isUserScammer,
};
