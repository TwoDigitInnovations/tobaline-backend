const LocalStrategy = require("passport-local").Strategy;
const User = require("@models/User");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, callback) => {
    try {
      const user = await User.findOne({ email });

      console.log(user);
      if (user) {
        if (!user.isPasswordMatch(password)) {
          return callback(null, false, { message: "Password is Incorrect." });
        }
      } else {
        return callback(null, false, { message: "User does not exist." });
      }
      return callback(null, user, { message: "Successfully LoggedIn." });
    } catch (error) {
      return callback(error);
    }
  },
);
