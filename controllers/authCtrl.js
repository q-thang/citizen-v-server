const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authCtrl = {
  register: async (req, res) => {
    try {
      const { username, password, regency, active } = req.body;

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        password: passwordHash,
        regency,
        active,
      });

      const access_token = createAccessToken({
        id: newUser._id,
      });

      const refresh_token = createRefreshToken({
        id: newUser._id,
      });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      await newUser.save();

      res.json({
        msg: "Đăng ký thành công!",
        access_token,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({
          msg: "Xin lỗi, không tìm thấy mã đơn vị phù hợp với mã đơn vị của bạn!",
        });
      }

      if (user.regency !== "A1") {
        if (user.regency.length !== username.length) {
          return res.status(400).json({
            msg: "Độ dài tài khoản không phù hợp với độ dài mã đơn vị đã được cấp.",
          });
        }
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          msg: "Sai mật khẩu. Vui lòng thử lại hoặc cài đặt lại mật khẩu.",
        });
      }

      const access_token = createAccessToken({
        id: user._id,
      });
      const refresh_token = createRefreshToken({
        id: user._id,
      });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });

      res.json({
        msg: "Đăng nhập thành công!",
        access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Đã đăng xuất" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Vui lòng đăng nhập." });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: "Vui lòng đăng nhập." });

          const user = await User.findById(result.id).select("-password");

          if (!user) {
            return res.status(400).json({ msg: "Người dùng không tồn tại." });
          }

          const access_token = createAccessToken({ id: result.id });

          res.json({
            access_token,
            refresh_token: rf_token,
            user,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = authCtrl;
