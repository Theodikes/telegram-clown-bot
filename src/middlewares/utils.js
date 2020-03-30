const stickersCtrl = require("../controllers/sticker");
const adminCtrl = require("../controllers/admin");
const userCtrl = require("../controllers/user");
const { OWNER } = require("./config");

const getStickerId = ctx => ctx.message.sticker.file_unique_id;
const getUserIDByReply = ctx => ctx.message.reply_to_message.from.id;
const getUserIDByForward = ctx => ctx.message.forward_from.id;
const getMentionedUserID = ctx =>
  parseInt(ctx.message.text.split(" ")[1] || 0, 10);
const getUsernameByMention = ctx => {
  const { offset, length } = ctx.message.entities.find(
    ent => ent.type === "mention"
  );

  return ctx.message.text.slice(offset + 1, offset + length);
};
const getUsernameByForward = ctx => ctx.message.forward_from.username;
const getUsernameByReply = ctx => ctx.message.reply_to_message.from.username;
const getCommand = ctx => ctx.message.text.split(" ")[0];
const getReplyedMessage = ctx => ctx.message.reply_to_message;
const getBannedUsers = () => bannedUsers;
const getScammers = () => scammers;

let admins = [];
const loadAndSetAdmins = async () => (admins = await adminCtrl.getAll());
loadAndSetAdmins();

const addAdmin = async ctx => {
  if (isAdmin(getReplyedMessage(ctx)))
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
  if (isAdmin(getReplyedMessage(ctx)))
    return "Невозможно сделать клоуном администратора.";
  if (isUserBanned(getReplyedMessage(ctx)))
    return "Извините, но он уже выступает в цирке";

  await userCtrl.ban(getUserIDByReply(ctx), getUsernameByReply(ctx));
  await loadAndSetBannedUsers();

  return "Назначен новый клоун";
};

const unbanUser = async ctx => {
  if (!isUserBanned(getReplyedMessage(ctx)))
    return "Пока еще в цирке не выступает, сначала наденьте ему маску клоуна";

  await userCtrl.unban(getUserIDByReply(ctx));
  await loadAndSetBannedUsers();

  return "Поздравляю, маска клоуна снята!";
};

let scammers = [];
const loadAndSetScammers = async () =>
  (scammers = await userCtrl.getScammers());
loadAndSetScammers();

const getScammerInfo = ctx => {
  if (isReplyedMessage(ctx))
    return [getUserIDByReply(ctx), getUsernameByReply(ctx)];
  if (isForwardedMessage(ctx))
    return [getUserIDByForward(ctx), getUsernameByForward(ctx)];

  return [
    getMentionedUserID(ctx),
    isMention(ctx) ? getUsernameByMention(ctx) : undefined
  ];
};

const setUserAsScam = async ctx => {
  const [id, username] = getScammerInfo(ctx);
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

const unsetUserAsScam = async ctx => {
  const [id] = getScammerInfo(ctx);
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
const isSticker = ctx => ctx.message.sticker;
const isStickerBanned = ctx => bannedStickers.includes(getStickerId(ctx));
const isUserBanned = ctx =>
  bannedUsers.map(user => user.id).includes(ctx.from.id);
const isUserScammer = ctx => {
  let id, username;
  if (isReplyedMessage(ctx)) {
    id = getUserIDByReply(ctx);
    username = getUsernameByReply(ctx);
  } else if (isForwardedMessage(ctx)) {
    id = getUserIDByForward(ctx);
    username = getUsernameByForward(ctx);
  } else {
    id = getMentionedUserID(ctx);
    username = isMention(ctx) ? getUsernameByMention(ctx) : "";
  }

  return (
    scammers.map(user => user.id).includes(id) ||
    scammers.map(user => user.username).includes(username)
  );
};
const isReplyedMessage = ctx => ctx.message.reply_to_message;
const isForwardedMessage = ctx => ctx.message.forward_date;
const isUserKnownByBot = ctx => ctx.message.forward_from;
const isMention = ctx =>
  ctx.message.entities &&
  ctx.message.entities.some(el => el.type === "mention");

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
  getUserIDByForward,
  isForwardedMessage,
  isUserKnownByBot,
  isUserScammer
};
