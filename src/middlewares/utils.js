import stickersCtrl from "../controllers/sticker.js";
import adminCtrl from "../controllers/admin.js";
import userCtrl from "../controllers/user.js";
import chatCtrl from "../controllers/chat.js";

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

const getUserMarkdownMention = (id, username) =>
  (username ? `@${username}` : `[${id}](tg://user?id=${id})`).replace(
    /_/g,
    "\\_"
  );
const getFullUserMarkdownMention = (id, username = "null") =>
  `- [${id}](tg://user?id=${id}): @${username}`.replace(/_/g, "\\_");

const getLowerCaseCommand = (ctx) => {
  const { offset, length } = ctx.message.entities.find(
    (ent) => ent.type === "bot_command"
  );

  return ctx.message.text.slice(offset + 1, offset + length).toLowerCase();
};

const getParsedCommandParams = (
  ctx,
  availableParameters = [],
  defaultParameters = {}
) => {
  const { offset, length } = ctx.message.entities.find(
    (ent) => ent.type === "bot_command"
  );

  const paramsString = ctx.message.text.slice(offset + length);
  const paramsArrayWithStringInKeyValueFormat = paramsString.split(/ ?-{1,2}/);
  const setDefault = paramsArrayWithStringInKeyValueFormat.some((parameter) =>
    /def|default/g.test(parameter)
  );
  const paramsArray = paramsArrayWithStringInKeyValueFormat.reduce(
    (paramsArray, currentString) => {
      let [parameter, value] = currentString.split(" ");
      if (!availableParameters.includes(parameter)) {
        return paramsArray;
      }

      if (value === "false" || value === "0") value = false;
      else if (value === "true" || value === "1" || !value) value = true;

      return [...paramsArray, [parameter, value]];
    },
    []
  );

  const params_dict = Object.fromEntries(paramsArray);
  const result_parameters = Object.assign(
    setDefault ? defaultParameters : {},
    params_dict
  );
  return result_parameters;
};

const getCurrentTelegramTime = (ctx) => ctx.message.date;
const getUnixtimePeriodByParameter = (ctx) => {
  const timeParameter = getParsedCommandParams(ctx, ["time"]).time;
  const parameter = timeParameter || ctx.message.text.split(" ")[1];
  if (!parseInt(parameter)) return 0;

  let timeUnit;
  if (parameter.endsWith("m")) timeUnit = 60;
  else if (parameter.endsWith("h")) timeUnit = 60 * 60;
  else if (parameter.endsWith("d")) timeUnit = 60 * 60 * 24;
  else {
    return "Неправильно указана единица времени, доступные значения: *m*, *h* и *d*.";
  }

  const period = parseInt(parameter) * 1000 * timeUnit;
  return period;
};
const getLastDayJoined = (ctx) => chats[ctx.chat.id]?.lastDayJoined;
const getJoinedInPeriod = async (chatID, periodInMilliseconds) => {
  if (!chats[chatID]) await loadAndSetChats();
  const currentDate = Date.now();
  return (
    chats[chatID]?.lastDayJoined.filter(
      ({ joinDate }) => joinDate > currentDate - periodInMilliseconds
    ) || []
  );
};
const getBannedUsers = () => bannedUsers;
const getScammers = () => scammers;
const getAdmins = () => admins;

const updateLastDayJoined = async (ctx) => {
  const chatID = ctx.chat.id;
  const currentDate = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const [new_chat_member, left_chat_member] = [
    "new_chat_members",
    "left_chat_member",
  ];
  const action = ctx.updateSubTypes.includes(new_chat_member)
    ? new_chat_member
    : left_chat_member;
  if (!chats[chatID]) await loadAndSetChats();

  if (action === left_chat_member) {
    const leftUserID = ctx.message.left_chat_member.id;

    chats[chatID].lastDayJoined = getJoinedInPeriod(chatID, day).filter(
      ({ id }) => id !== leftUserID
    );
  } else {
    const newUser = {
      joinDate: currentDate,
      id: ctx.message.new_chat_member.id,
      joinMessageId: ctx.message.message_id,
    };

    chats[chatID].lastDayJoined = [...getJoinedInPeriod(chatID, day), newUser];
  }
};

let chats = [];
const loadAndSetChats = async () => (chats = await chatCtrl.getAll());
loadAndSetChats();

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

const isAdmin = (id) => admins.some((admin) => admin.id == id);
const isCommand = (ctx) =>
  ctx.message.text?.startsWith("/") &&
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
  ctx.message.entities?.some((el) => el.type === "mention");
const isChatAttacked = (ctx) => chats[ctx.message.chat.id]?.attacked;

export {
  isGroup,
  isSticker,
  isStickerBanned,
  isUserBanned,
  isAdmin,
  isCommand,
  getSelf,
  getLowerCaseCommand,
  getParsedCommandParams,
  getUserMarkdownMention,
  getFullUserMarkdownMention,
  isReplyedMessage,
  getBannedUsers,
  getScammers,
  getAdmins,
  getCurrentTelegramTime,
  getUnixtimePeriodByParameter,
  getLastDayJoined,
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
  loadAndSetChats,
  isChatAttacked,
  updateLastDayJoined,
  getJoinedInPeriod,
};
