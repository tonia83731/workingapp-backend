const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const bcrypt = require("bcryptjs");
const User = require("../models/user-models");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user)
          return done(null, false, {
            message: "User didn't exist!",
          });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
          return done(null, false, {
            message: "Email or Password error.",
          });

        // console.log(email, password);
        return done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload._id);
      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  })
);

// 設定序列話與反序列化
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findById(id);
    user = user.toJSON();
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = passport;
