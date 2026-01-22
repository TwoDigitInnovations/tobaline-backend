const passport = require("passport");
const response = require("../responses");
const userHelper = require("../helper/user");
const { logmate } = require("./logmate");

module.exports = (role = []) => {
  return (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async function (err, user, info) {
        if (err) {
          return response.error(res, err);
        }
        if (!user) {
          return response.unAuthorize(res, info);
        }
        const userData = await userHelper.find({ _id: user.id });

        if (role.indexOf(userData.role) == -1) {
          return response.unAuthorize(res, {
            message: "Invalid token. You need to log in again",
          });
        }
        req.user = user;
        await logmate(req, res, userData);
        return next();
      },
    )(req, res, next);
  };
};
