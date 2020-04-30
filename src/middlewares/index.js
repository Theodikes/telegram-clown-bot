import userMiddleware from "./user/index.js";
import adminMiddleware from "./admin/index.js";
import developerMiddleware from "./developer/index.js";
import bannedMiddleware from "./banned/index.js";
import privateMiddleware from "./forward/index.js";
import onlyMessagesAllowed from "./onlyMessages/index.js";

export {
  userMiddleware,
  adminMiddleware,
  developerMiddleware,
  bannedMiddleware,
  privateMiddleware,
  onlyMessagesAllowed,
};
