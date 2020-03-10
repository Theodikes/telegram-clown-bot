module.exports = async (ctx, next) => {
  if (!ctx.message || !ctx.from || !ctx.chat) return;

  await next();
};
