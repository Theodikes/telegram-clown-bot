export const onlyMessagesAllowed = async (ctx, next) => {
  try {
    if (ctx.updateType !== "message") return;

    await next();
  } catch (e) {}

  return;
};
