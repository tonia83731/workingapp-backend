if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const mongoose_url = process.env.MONGODB_URL;
const User = require("../models/user-models");

mongoose
  .connect(mongoose_url)
  .then(async () => {
    console.log("mongodb connected!");
    const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(password, salt);
    // user seeds
    const user_data = [
      {
        name: "Admin",
        email: "admin@example.com",
        password: bcrypt.hashSync("Test1234", salt),
      },
      {
        name: "LunaSky",
        email: "luna.sky@example.com",
        password: bcrypt.hashSync("moonLight2024", salt),
      },
      {
        name: "NovaBlaze",
        email: "nova.blaze@example.com",
        password: bcrypt.hashSync("starFlare789", salt),
      },
      {
        name: "SolsticeRay",
        email: "solstice.ray@example.com",
        password: bcrypt.hashSync("sunBeam007", salt),
      },
    ];

    await User.insertMany(user_data);
    console.log("user seeds added");

    await mongoose.disconnect();
    console.log("mongodb connection closed");
  })
  .catch((err) => console.error("mongodb error!", err.message));
