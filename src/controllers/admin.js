const Admin = require("../database/models/admin");

const resultItemConverter = item => item.id;

const getAll = () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await Admin.find();
      const admins = result.map(item => resultItemConverter(item));

      resolve(admins);
    } catch (err) {
      console.error(
        "Невозможно получить список администраторов. Проблемы с доступом к базе данных."
      );
      console.error(err);
      reject();
    }
  });

const add = (id, username = "") =>
  new Promise(async (resolve, reject) => {
    try {
      const admin = new Admin({ id, username });

      const result = await admin.save();
      resolve(resultItemConverter(result));
    } catch (err) {
      reject(
        new Error(
          "Невозможно добавить нового администратора. Проблемы с доступом к базе данных."
        )
      );
    }
  });

const remove = id =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await Admin.findOneAndRemove({ id });
      resolve(result);
    } catch (err) {
      console.error(err);
      reject(
        new Error(
          "Нет доступа к базе данных. Удаление администратора невозможно."
        )
      );
    }
  });

module.exports = {
  getAll,
  add,
  remove
};
