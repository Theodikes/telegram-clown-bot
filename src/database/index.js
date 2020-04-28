const mongoose = require("mongoose");
const { user, pass, host, name, options = "" } = require("./config");

const uri = `mongodb+srv://${user}:${pass}@${host}/${name}?${options}`;

mongoose.Promise = global.Promise;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log(`Mongoose connection open on ${uri}`);
});

db.on("error", (err) => console.error(err));

db.on("disconnected", () => {
  console.log("mongoose connection disconnected");
});
