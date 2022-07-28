var fs = require("fs");
var express = require("express");
const mongoose = require("mongoose");
const routes2 = require("./routes/routes2");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

require("./routes/routes")(app);
app.use(routes2);
mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb+srv://it4u:Db20112015@cluster0.ofqaz.mongodb.net/task_manager?retryWrites=true&w=majority",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
  }
);

app.listen(PORT, function () {
  //console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
 // console.log(process.env.NODE_ENV);
});
