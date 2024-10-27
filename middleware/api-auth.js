const passport = require("../config/passport");
const { sendErrorResponse } = require("../helpers/resHelpers");

const authenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) return sendErrorResponse(res, 401, "Unauthorized");
    next();
  })(req, res, next);
};

module.exports = { authenticated };
