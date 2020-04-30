import { isAdmin, getLowerCaseCommand, getSelf } from "../utils.js";
import manageAdministration from "./admin.js";
import editBanlist from "./ban.js";
import editScamlist from "./scam.js";
import sendScamlist from "./scamlist.js";
import sendBanlist from "./banlist.js";
import {
  scamlistCommands,
  banlistCommands,
  banManagementCommands,
  scamManagementCommands,
  adminManagementCommands,
} from "../../commands/index.js";

export default async (ctx, next) => {
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
