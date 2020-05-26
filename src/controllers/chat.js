import Chat from "../database/models/chat.js";

const resultItemConverter = (item) => item.id;

const resultConverter = (res) => {
  let chats = {};
  res.forEach(({ id, attacked, lastDayJoined }) => {
    chats[id] = {
      attacked,
      lastDayJoined,
    };
  });

  return chats;
};

const getAll = () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await Chat.find();
      const chats = resultConverter(result);

      resolve(chats);
    } catch (err) {
      console.error(
        "Невозможно получить список чатов. Проблемы с доступом к базе данных."
      );
      console.error(err);
      reject();
    }
  });

const updateLastDayJoined = (id, users) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await Chat.findOneAndUpdate(
        { id },
        { lastDayJoined: users },
        { upsert: true }
      );

      resolve();
    } catch (err) {
      console.error(
        "База данных недоступна. Невозможно обновить список зашедших в последний час"
      );
      reject();
    }
  });

const add = (id, title = "") =>
  new Promise(async (resolve, reject) => {
    try {
      const chat = new Chat({ id, title });

      const result = await chat.save();
      resolve(resultItemConverter(result));
    } catch (err) {
      reject(new Error("Этот чат уже сохранен в базу данных"));
    }
  });

const setAttackState = (id, state = false) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await Chat.findOneAndUpdate(
        { id },
        { attacked: state },
        { upsert: true }
      );

      resolve();
    } catch (err) {
      console.error(err);
      reject("База данных недоступна.");
    }
  });

export default { getAll, updateLastDayJoined, add, setAttackState };
