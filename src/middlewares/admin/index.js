import { isAdmin, getLowerCaseCommand, getSelf } from "../utils.js";
import manageAdministration from "./admin.js";
import editClownlist from "./clown.js";
import editScamlist from "./scam.js";
import sendScamlist from "./scamlist.js";
import sendClownlist from "./clownlist.js";
import {
  scamlistCommands,
  clownlistCommands,
  banManagementCommands,
  scamManagementCommands,
  adminManagementCommands,
} from "../../commands/index.js";

export const adminMiddleware = async (ctx, next) => {
  if (!isAdmin(getSelf(ctx))) {
    await next();
    return;
  }

  const command = getLowerCaseCommand(ctx);

  if (clownlistCommands.includes(command)) await sendClownlist(ctx);
  else if (scamlistCommands.includes(command)) await sendScamlist(ctx);
  else if (scamManagementCommands.includes(command)) await editScamlist(ctx);
  else if (banManagementCommands.includes(command)) await editClownlist(ctx);
  else if (adminManagementCommands.includes(command))
    await manageAdministration(ctx);

  await next();
};
