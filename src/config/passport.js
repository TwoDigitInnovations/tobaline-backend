const passport = require("passport");
const localStrategy = require("../strategies/local.strategy");
const jwtStrategy = require("../strategies/jwt.strategy");

module.exports = () => {
  passport.use("local", localStrategy);
  passport.use("jwt", jwtStrategy);
};
