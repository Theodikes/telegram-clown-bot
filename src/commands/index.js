const helpCommands = ["help", "start"];
const banlistCommands = ["clowns", "banned", "banlist"];
const scamlistCommands = ["scammers", "getScammers", "scamlist"];
const banManagementCommands = [
  "clown",
  "deClown",
  "unClown",
  "declown",
  "unclown",
];
const scamManagementCommands = ["scam", "noScam", "unScam", "noscam", "unscam"];
const adminManagementCommands = [
  "setAdmin",
  "addAdmin",
  "deleteAdmin",
  "removeAdmin",
  "setadmin",
  "addadmin",
  "deleteadmin",
  "removeadmin",
];

const usersCommands = ["isscam", "isScam", ...helpCommands];
const adminsCommands = [
  ...adminManagementCommands,
  ...scamManagementCommands,
  ...banManagementCommands,
  ...scamlistCommands,
  ...banlistCommands,
];
const developerCommands = [
  "unbanAll",
  "info",
  "underAttack",
  "kickAll",
  "addChat",
];

export {
  usersCommands,
  adminsCommands,
  developerCommands,
  helpCommands,
  scamlistCommands,
  banlistCommands,
  banManagementCommands,
  scamManagementCommands,
  adminManagementCommands,
};
