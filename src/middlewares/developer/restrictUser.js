import {
  getParsedCommandParams,
  getUser,
  getCurrentTelegramTime,
  getUserMarkdownMention,
  getUnixtimePeriodByParameter,
} from "../utils.js";
const availableParameters = [
  "can_send_media_messages",
  "can_send_polls",
  "can_send_other_messages",
  "can_add_web_page_previews",
  "can_invite_users",
  "can_change_info",
  "can_send_messages",
];
const defaultOptions = Object.fromEntries(
  availableParameters.map((option) => [option, true])
);

export default async (ctx) => {
  const permissions = getParsedCommandParams(
    ctx,
    availableParameters,
    defaultOptions
  );
  const [id, username] = getUser(ctx);
  const periodInSeconds = getUnixtimePeriodByParameter(ctx) / 1000;
  const currentTelegramDate = getCurrentTelegramTime(ctx);
  const untilDate = currentTelegramDate + periodInSeconds;

  try {
    await ctx.telegram.restrictChatMember(
      ctx.chat.id,
      id,
      permissions,
      untilDate
    );

    return `Изменены права пользователя ${getUserMarkdownMention(
      id,
      username
    )}`;
  } catch (err) {
    return err.code === 400
      ? "Невозможно изменить права администратора чата"
      : "Неизвестная ошибка";
  }
};
