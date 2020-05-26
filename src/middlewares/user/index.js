import { getLowerCaseCommand } from "../utils.js";
import { helpCommands } from "../../commands/index.js";
import helpHandler from "./help.js";
import scamHandler from "./scam.js";

export const userMiddleware = async (ctx, next) => {
  const command = getLowerCaseCommand(ctx);

  if (helpCommands.includes(command)) await helpHandler(ctx);
  if (command == "isscam") await scamHandler(ctx);

  await next();
};
