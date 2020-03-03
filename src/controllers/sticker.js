const Sticker = require("../database/models/sticker");

const resultItemConverter = item => item.file_id;

const getAll = () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await Sticker.find();

      resolve(result.map(item => resultItemConverter(item)));
    } catch (err) {
      console.error(
        "Невозможно получить список заблокированных стикеров. Проблемы с доступом к базе данных."
      );
      console.error(err);
      reject();
    }
  });

const add = id =>
  new Promise(async (resolve, reject) => {
    try {
      const sticker = new Sticker({ file_id: id });

      const result = await sticker.save();
      resolve(resultItemConverter(result));
    } catch (err) {
      reject(new Error("Ошибка сохранения стикера в базу данных"));
    }
  });
const remove = id =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await Sticker.findOneAndRemove({ file_id: id });
      resolve(result);
    } catch (err) {
      console.log(err);
      reject(new Error("Ошибка удаления стикера из базы данных"));
    }
  });

module.exports = {
  getAll,
  add,
  remove
};
