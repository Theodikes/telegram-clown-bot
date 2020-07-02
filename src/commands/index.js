const helpCommands = ["help", "start"];
const clownlistCommands = ["clowns", "banned", "Clownlist"];
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
  "info",
  ...adminManagementCommands,
  ...scamManagementCommands,
  ...banManagementCommands,
  ...scamlistCommands,
  ...clownlistCommands,
];
const developerCommands = [
  "unclownAll",
  "underAttack",
  "kickAll",
  "addChat",
  "ban",
  "unban",
  "restrict",
  "admins",
];

export {
  usersCommands,
  adminsCommands,
  developerCommands,
  helpCommands,
  scamlistCommands,
  clownlistCommands,
  banManagementCommands,
  scamManagementCommands,
  adminManagementCommands,
};
