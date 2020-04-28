const User = require("../database/models/user");

const resultItemConverter = ({ id, username }) => ({ id, username });

const getBanned = () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await User.find({ banned: true });
      const bannedUsers = result.map((item) => resultItemConverter(item));

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

const unban = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await User.findOneAndUpdate(
        { id },
        { banned: false },
        { upsert: true }
      );
      resolve(result);
    } catch (err) {
      console.error(err);
      reject("Невозможно разблокировать юзера. База данных недоступна.");
    }
  });

const getScammers = () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await User.find({ isScam: true });
      const scammers = result.map((item) => resultItemConverter(item));

      resolve(scammers);
    } catch (err) {
      console.error(
        "Невозможно получить список скамеров. Проблемы с доступом к базе данных"
      );
      reject();
    }
  });

const setAsScam = (id, username) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await User.findOneAndUpdate(
        { id },
        { isScam: true, username },
        { upsert: true }
      );
      resolve(result);
    } catch (err) {
      console.error(
        `Невозможно пометить юзера ${id} как скамера. База данных недоступна.`
      );
      reject();
    }
  });

const unsetAsScam = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await User.findOneAndUpdate(
        { id },
        { isScam: false },
        { upsert: true }
      );
      resolve(result);
    } catch (err) {
      console.error(
        `Невозможно убрать юзера ${id} из скамлиста. База данных недоступна.`
      );
      reject();
    }
  });

module.exports = {
  getBanned,
  getScammers,
  ban,
  unban,
  setAsScam,
  unsetAsScam,
};
