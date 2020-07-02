import { getAdmins, getFullUserMarkdownMention } from "../utils.js";

export default async () => {
  const admins = getAdmins();

  const formattedMarkdownMessage = `*Список администраторов*: \n\n${admins
    .map(({ id, username }) => getFullUserMarkdownMention(id, username))
    .join("\n")}`;

  return formattedMarkdownMessage;
};
