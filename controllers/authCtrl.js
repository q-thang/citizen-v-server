const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Unit = require("../models/Unit");

const authCtrl = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({
          msg: "Xin lỗi, không tìm thấy mã đơn vị phù hợp với mã đơn vị của bạn!",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          msg: "Sai mật khẩu. Vui lòng thử lại hoặc cài đặt lại mật khẩu.",
        });
      }

      //  Set active
      let { regency, startTime, endTime } = user
      if (regency === 'A1') {
        await User.findByIdAndUpdate(user._id, { active: true })
      } else {
        if (new Date(startTime) <= new Date() && new Date(endTime) >= new Date()) {
          await User.findByIdAndUpdate(user._id, { active: true })
        } else {
          await User.findByIdAndUpdate(user._id, { active: false })
        }
      }

      const access_token = createAccessToken({
        id: user._id,
      });
      const refresh_token = createRefreshToken({
        id: user._id,
      });

      // find current unit

      let unitOfUser;
      let unitOfParentUser;
      let unitOfGrandUser;
      let unitOfGreatGrandUser;

      unitOfUser = await Unit.findOne({ code: user.username });

      let res_user = {
        ...user._doc,
        nameOfUnit: user.regency !== "A1" ? unitOfUser.nameOfUnit : "",
        password: "",
      };

      // find parent of current unit
      if (["A3", "B1", "B2"].includes(user.regency)) {
        unitOfParentUser = await Unit.findById(unitOfUser.idParent);
        res_user = {
          ...res_user,
          nameOfParentUnit: unitOfParentUser.nameOfUnit,
        };
      }

      // find grand of current unit
      if (["B1", "B2"].includes(user.regency)) {
        unitOfGrandUser = await Unit.findById(unitOfParentUser.idParent);
        res_user = { ...res_user, nameOfGrandUnit: unitOfGrandUser.nameOfUnit };
      }

      // find great grand of current unit
      if (user.regency === "B2") {
        unitOfGreatGrandUser = await Unit.findById(unitOfGrandUser.idParent);
        res_user = {
          ...res_user,
          nameOfGreatGrandUnit: unitOfGreatGrandUser.nameOfUnit,
        };
      }

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });

      res.json({
        msg: "Đăng nhập thành công!",
        access_token,
        user: res_user,
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
        return res.status(402).json({ msg: "Vui lòng đăng nhập." });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(402).json({ msg: "Vui lòng đăng nhập." });

          const user = await User.findById(result.id).select("-password");

          if (!user) {
            return res.status(402).json({ msg: "Người dùng không tồn tại." });
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
      return res.status(402).json({ msg: err.message });
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
