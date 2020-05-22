import { isGroup, isAdmin, getSelf } from "../utils.js";

export default async (ctx) => {
  if (isGroup(ctx)) return;

  const securityClearance = isAdmin(getSelf(ctx)) ? "admin" : "user";

  const banUser = "Бан пользователей";
  const setUserAsScam = "Внесение юзеров в скамлист";
  const banSticker = "Бан стикеров в беседе";
  const getBanlist = "Получение списка заблокированных";
  const getScamlist = "Получение скамлиста";
  const checkScam = "Проверка пользователей на скам";

  const adminCommands = [
    banUser,
    setUserAsScam,
    banSticker,
    getBanlist,
    getScamlist,
  ];

  const userCommands = [checkScam];

  const availableOptions = {
    user: userCommands,
    admin: [...adminCommands, ...userCommands],
  };

  const instructions = {
    [checkScam]: `*1*. Вы пересылаете(forward) боту любое сообщение юзера. Способ ненадежный, поскольку боту по техническим причинам может быть недоступно id пользователя.

*2*. В беседе, где есть бот, вы отвечаете на сообщение пользователя (reply) командой */isScam* и бот проверяет, есть ли человек в скам-листе

*3*. Полноценный запрос к боту - */isScam userId @username*. Может быть указан как один параметр, так и оба. Если id указано, то оно должно быть первым параметром запроса.
            

*WARNING*: отсутствие человека в скам-листе не означает, что он не является скамером. Он может быть еще не занесен, либо мог просто изменить юзернейм (если вы делали запрос только по юзернейму)`,

    [banUser]: `*1*. Ответить на сообщение пользователя в беседе командой */clown*, чтобы заблокировать, или */unclown*, чтобы разблокировать. Заблокированные юзеры не банятся, просто все их новые сообщения моментально удаляются, что позволяет применять команду */clown* к администраторам беседы.

*2*. Команда */clown userId @username*, может быть выполнена как в беседе, так и в личной переписке с ботом. userId - обязательный параметр, команда */unclown* работает аналогично`,

    [setUserAsScam]: `*1*. Ответить на сообщение пользователя в беседе командой */scam*, чтобы добавить в скамлист и автоматически заблокировать, или */noscam*, чтобы удалить из скам-листа и заблокировать. Если (вдруг) требуется разблокировать, не удаляя из скам-листа - используем */unclown* к добавленному в скамлист пользователю.
    
*2*. Полная команда - */scam userId @username*, userId - required. Желательно указывать username, поскольку по нему смогут проверить на скам обычные пользователи`,

    [banSticker]: `Так как стикер невозможно отправить вместе с текстом, его можно заблокировать лишь через личные сообщения с ботом. Отправьте в личку боту стикер, и он его заблокирует в беседе (будет автоматически удалять при отправке). Повторная отправка стикера в личку боту его разблокирует.
    
Примечание: админы бота могут использовать заблокированные стикеры в беседе`,

    [getBanlist]: `Отправляет полный банлист в формате id:username одним сообщением по команде */clowns* или */banned*. Команды работают только у администраторов, чтобы этим не заспамили чат.`,

    [getScamlist]: `Отправляет полный список скамеров в формате id:username одним сообщением по команде */scamlist* или */scammers*. Команды работают только у администраторов, чтобы этим не заспамили чат.`,
  };
  const formattedOptions = availableOptions[securityClearance]
    .map((option) => `\n*-* ${option}`)
    .join(";");

  const baseMessage = `Доступные для вашего уровня доступа действия: 
    ${formattedOptions}\n`;

  const markdownMessage =
    baseMessage +
    availableOptions[securityClearance].reduce(
      (acc, option) => acc + `\n\n\n*${option}*:\n\n ${instructions[option]}`,
      ""
    );

  await ctx.replyWithMarkdown(markdownMessage);
};
