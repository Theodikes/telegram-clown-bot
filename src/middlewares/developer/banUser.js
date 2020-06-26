import {
  getUserMarkdownMention,
  getUnixtimePeriodByParameter,
  getUser,
} from "../utils.js";

export default async (ctx) => {
  const [id, username] = getUser(ctx);

  try {
    const periodInSeconds = getUnixtimePeriodByParameter(ctx) / 1000;
    const currentTelegramDate = ctx.message.date;
    const untilDate = currentTelegramDate + periodInSeconds;

    await ctx.kickChatMember(id, untilDate);
    return `${getUserMarkdownMention(id, username)} удален из чата`;
  } catch (err) {
    return err.code === 400
      ? "Невозможно заблокировать администратора чата"
      : "Неизвестная ошибка";
  }
};
