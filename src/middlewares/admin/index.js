const {
  isAdmin,
  isGroup,
  isSticker,
  isForwardedMessage,
  getLowerCaseCommand,
  getSelf,
} = require("../../utils");
const manageAdministration = require("./admin");
const editBanlist = require("./ban");
const editScamlist = require("./scam");
const sendScamlist = require("./scamlist");
const sendBanlist = require("./banlist");
const {
  scamlistCommands,
  banlistCommands,
  banManagementCommands,
  scamManagementCommands,
  adminManagementCommands,
} = require("../../commands");

module.exports = async (ctx, next) => {
  if (!isAdmin(getSelf(ctx))) {
    await next();
    return;
  }

  const command = getLowerCaseCommand(ctx);

  if (banlistCommands.includes(command)) await sendBanlist(ctx);
  else if (scamlistCommands.includes(command)) await sendScamlist(ctx);
  else if (scamManagementCommands.includes(command)) await editScamlist(ctx);
  else if (banManagementCommands.includes(command)) await editBanlist(ctx);
  else if (adminManagementCommands.includes(command))
    await manageAdministration(ctx);

  await next();
};
