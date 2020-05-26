import { getJoinedInPeriod } from "../utils.js";

export default async (ctx) => {
  const parameter = ctx.message.text.split(" ")[1];
  let timeUnit;
  if (parameter.endsWith("m")) timeUnit = 60;
  else if (parameter.endsWith("h")) timeUnit = 60 * 60;
  else if (parameter.endsWith("d")) timeUnit = 60 * 60 * 24;
  else {
    return "Неправильно указана единица времени, доступные значения: *m*, *h* и *d*.";
  }

  const period = parseInt(parameter) * 1000 * timeUnit;
  const joinedInPeriod = getJoinedInPeriod(ctx.chat.id, period);

  for (const user of joinedInPeriod) {
    await ctx.telegram.kickChatMember(ctx.chat.id, user.id);
    await ctx.telegram.deleteMessage(ctx.chat.id, user.joinMessageId);
  }

  return `Чат очищен от зашедших за последние ${parameter}.`;
};
