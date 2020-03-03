const User = require("../database/models/users");

const resultItemConverter = item => item.id;

const getBanned = () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await User.find({ banned: true });
      const bannedUsers = result.map(item => resultItemConverter(item));

      resolve(bannedUsers);
    } catch (err) {
      console.error(
        "Невозможно получить список заблокированных пользователей. Проблемы с доступом к базе данных"
      );
      reject();
    }
  });

const ban = (id, username) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await User.findOneAndUpdate(
        { id },
        { banned: true, username, $inc: { bans: 1 } },
        { upsert: true }
      );
      resolve(result);
    } catch (err) {
      console.error(
        "Невозможно заблокировать юзера. Проблема с доступом к базе данных."
      );
      reject();
    }
  });

const unban = id =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await User.updateOne(
        { id },
        { banned: false },
        { upsert: true }
      );
      resolve(result);
    } catch (err) {
      console.error("Невозможно разблокировать юзера. База данных недоступна.");
      reject();
    }
  });

module.exports = {
  getBanned,
  ban,
  unban
};
