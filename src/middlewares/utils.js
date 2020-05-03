import stickersCtrl from "../controllers/sticker.js";
import adminCtrl from "../controllers/admin.js";
import userCtrl from "../controllers/user.js";

const getSelf = (ctx) => ctx.from.id;
const getStickerId = (ctx) => ctx.message.sticker.file_unique_id;
const getUserID = (ctx) => {
  if (isReplyedMessage(ctx)) return ctx.message.reply_to_message.from.id;
  if (isForwardedMessage(ctx))
    return isUserKnownByBot(ctx) ? ctx.message.forward_from.id : undefined;

  return parseInt(ctx.message.text.split(" ")[1] || 0, 10);
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

  return null;
};
const getUser = (ctx) => [getUserID(ctx), getUsername(ctx)];
const getUserMentionInMarkdownFormat = (id, username = "null") =>
  `- [${id}](tg://user?id=${id}): @${username}`.replace(/_/g, "\\_");
const getLowerCaseCommand = (ctx) => {
  const { offset, length } = ctx.message.entities.find(
    (ent) => ent.type === "bot_command"
  );

  return ctx.message.text.slice(offset + 1, offset + length).toLowerCase();
};
const getBannedUsers = () => bannedUsers;
const getScammers = () => scammers;

let admins = [];
const loadAndSetAdmins = async () => (admins = await adminCtrl.getAll());
loadAndSetAdmins();

let bannedUsers = [];
const loadAndSetBannedUsers = async () =>
  (bannedUsers = await userCtrl.getBanned());
loadAndSetBannedUsers();

let scammers = [];
const loadAndSetScammers = async () =>
  (scammers = await userCtrl.getScammers());
loadAndSetScammers();

let bannedStickers = [];
const loadAndSetBannedStickers = async () =>
  (bannedStickers = await stickersCtrl.getAll());
loadAndSetBannedStickers();

const isAdmin = (id) => admins.includes(id);
const isCommand = (ctx) =>
  ctx.message.text &&
  ctx.message.text.startsWith("/") &&
  ctx.message.entities &&
  ctx.message.entities[0].type === "bot_command";
const isGroup = (ctx) => ctx.chat.type !== "private";
const isSticker = (ctx) => ctx.updateSubTypes.includes("sticker");
const isStickerBanned = (ctx) => bannedStickers.includes(getStickerId(ctx));
const isUserBanned = (id) => bannedUsers.map((user) => user.id).includes(id);
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

export {
  isGroup,
  isSticker,
  isStickerBanned,
  isUserBanned,
  isAdmin,
  isCommand,
  getSelf,
  getLowerCaseCommand,
  getUserMentionInMarkdownFormat,
  isReplyedMessage,
  getBannedUsers,
  getScammers,
  getUser,
  getUserID,
  getUsername,
  getStickerId,
  isForwardedMessage,
  isUserKnownByBot,
  isUserScammer,
  loadAndSetAdmins,
  loadAndSetBannedStickers,
  loadAndSetBannedUsers,
  loadAndSetScammers,
};
