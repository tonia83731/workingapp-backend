if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("./config/passport");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 8080;

const mongoose_url = process.env.MONGODB_URL;
// mongoose.set("strictQuery", true);
mongoose
  .connect(mongoose_url)
  .then(() => console.log("mongodb connected!"))
  .catch((err) => console.error("mongodb error!", err.message));
// , {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
