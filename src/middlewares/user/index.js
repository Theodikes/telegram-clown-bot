const { getLowerCaseCommand } = require("../../utils");
const { helpCommands } = require("../../commands");
const helpHandler = require("./help");
const scamHandler = require("./scam");

module.exports = async (ctx, next) => {
  const command = getLowerCaseCommand(ctx);

  if (helpCommands.includes(command)) await helpHandler(ctx);
  if (command == "isscam") await scamHandler(ctx);

  await next();
};
