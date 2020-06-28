import { getJoinedInPeriod, getUnixtimePeriodByParameter } from "../utils.js";

export default async (ctx) => {
  const period = getUnixtimePeriodByParameter(ctx);
  const joinedInPeriod = await getJoinedInPeriod(ctx.chat.id, period);

  for (const user of joinedInPeriod) {
    await ctx.telegram.kickChatMember(ctx.chat.id, user.id);
    await ctx.telegram.deleteMessage(ctx.chat.id, user.joinMessageId);
  }

  return `Чат очищен от зашедших за последние ${parameter}.`;
};
