module.exports = async (ctx, next) => {
  if (ctx.updateType !== "message") return;

  await next();
};
