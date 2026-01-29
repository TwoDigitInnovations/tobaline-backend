const User = require("@models/User");
const Verification = require("@models/verification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const response = require("../responses");
const userHelper = require("../helper/user");
const { logmate } = require("../middlewares/logmate");
const jwtService = require("../services/jwtService");
const passport = require("passport");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password, phone, role, organization } = req.body;

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      if (role) {
        newUser.role = role;
      }

      if (phone) {
        newUser.phone = phone;
      }

      await newUser.save();

      const userResponse = await User.findById(newUser._id).select("-password");
      return response.ok(res, {
        message: "User registered successfully.",
        data: userResponse,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return response.badReq(res, {
          message: "Email and password are required",
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return response.unAuthorize(res, { message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.unAuthorize(res, { message: "Password does not match" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
      );

      const newData = {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        },
      };

      return response.ok(res, newData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  loginwithOtp: (req, res) => {
    passport.authenticate(
      "local",
      { session: false },
      async (err, user, info) => {
        if (err) {
          return response.error(res, err);
        }
        console.log(err, user, info);

        if (!user) {
          return response.unAuthorize(res, info);
        }

        await logmate(req, res, user);
        if (user.role === "USER") {
          return response.conflict(res, { message: "Invalid account" });
        }
        let ran_otp = Math.floor(1000 + Math.random() * 9000);

        const email = user.email;
        console.log(email, ran_otp);

        let ver = new Verification({
          user: user._id,
          otp: ran_otp,
          expiration_at: userHelper.getDatewithAddedMinutes(5),
        });
        await ver.save();

        let token = await userHelper.encode(ver._id);
        return response.ok(res, { message: "OTP sent.", token });
      },
    )(req, res);
  },

  verifyOTPForLogin: async (req, res) => {
    try {
      const { otp, token } = req.body;

      if (!(otp && token)) {
        return response.badReq(res, { message: "otp and token required." });
      }

      let verId = await userHelper.decode(token);
      let ver = await Verification.findById(verId);

      if (!ver) {
        return response.notFound(res, { message: "Invalid token" });
      }

      let user = await User.findById(ver.user);
      await logmate(req, res, user);

      const isOtpValid = otp == ver.otp || otp === "0000"; // 👈 master OTP

      const isNotExpired =
        new Date().getTime() < new Date(ver.expiration_at).getTime();

      if (isOtpValid && !ver.verified && isNotExpired) {
        ver.verified = true;
        await ver.save();

        let jwtToken = await new jwtService().createJwtToken({
          id: user._id,
          type: user.type,
          tokenVersion: new Date(),
        });

        const userdata = await User.findById(user._id, "-password").lean();

        return response.ok(res, {
          ...userdata,
          token: jwtToken,
        });
      }

      return response.notFound(res, { message: "Invalid OTP" });
    } catch (error) {
      return response.error(res, error.message || error);
    }
  },

  sendOTP: async (req, res) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email });

      if (!user) {
        return response.badReq(res, { message: "Email does exist." });
      }

      let ran_otp = Math.floor(1000 + Math.random() * 9000);

      let ver = new Verification({
        user: user._id,
        otp: ran_otp,
        expiration_at: userHelper.getDatewithAddedMinutes(5),
      });
      await ver.save();

      let token = await userHelper.encode(ver._id);

      return response.ok(res, { message: "OTP sent.", token });
    } catch (error) {
      return response.error(res, error);
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const otp = req.body.otp;
      const token = req.body.token;
      if (!(otp && token)) {
        return response.badReq(res, { message: "otp and token required." });
      }
      let verId = await userHelper.decode(token);
      let ver = await Verification.findById(verId);
      if (
        otp == ver.otp &&
        !ver.verified &&
        new Date().getTime() < new Date(ver.expiration_at).getTime()
      ) {
        let token = await userHelper.encode(
          ver._id + ":" + userHelper.getDatewithAddedMinutes(5).getTime(),
        );
        ver.verified = true;
        await ver.save();
        return response.ok(res, { message: "OTP verified", token });
      } else {
        return response.notFound(res, { message: "Invalid OTP" });
      }
    } catch (error) {
      return response.error(res, error);
    }
  },

  changePassword: async (req, res) => {
    try {
      const token = req.body.token;
      const password = req.body.password;
      const data = await userHelper.decode(token);
      const [verID, date] = data.split(":");
      if (new Date().getTime() > new Date(date).getTime()) {
        return response.forbidden(res, { message: "Session expired." });
      }
      let otp = await Verification.findById(verID);
      if (!otp.verified) {
        return response.forbidden(res, { message: "unAuthorize" });
      }
      let user = await User.findById(otp.user);
      if (!user) {
        return response.forbidden(res, { message: "unAuthorize" });
      }
      await Verification.findByIdAndDelete(verID);
      user.password = user.encryptPassword(password);
      await user.save();
      return response.ok(res, { message: "Password changed! Login now." });
    } catch (error) {
      return response.error(res, error);
    }
  },

  MyProfile: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return response.unAuthorize(res, {
          message: "Invalid token or user not found",
        });
      }

      const user = await User.findById(req.user.id).select("-password");

      if (!user) {
        return response.notFound(res, {
          message: "User not found",
        });
      }

      return response.ok(res, {
        message: "Profile fetched successfully",
        data: user,
      });
    } catch (error) {
      console.error("My profile error:", error);
      return response.error(res, error.message || "Something went wrong");
    }
  },

  updateprofile: async (req, res) => {
    try {
      const payload = req.body;
      if (req.file && req.file.location) {
        payload.image = req.file.location;
      }
      console.log("payload", req.user.id);
      const user = await User.findByIdAndUpdate(req.user.id, payload, {
        new: true,
        upsert: true,
      });
      return response.ok(res, { user, message: "Profile Updated Succesfully" });
    } catch (error) {
      return response.error(res, error);
    }
  },
  fileUpload: async (req, res) => {
    try {
      if (!req.file) {
        return response.badRequest(res, { message: "No file uploaded." });
      }
      console.log(req.file);
      return response.ok(res, {
        message: "File uploaded successfully.",
        fileUrl: req.file.path,
        fileName: req.file.filename,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
