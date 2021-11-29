const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    let token;

    // run in postman
    if (req.header("Authorization").split(" ").length === 2) {
      token = req.header("Authorization").split(" ")[1];
    } else {
      // run in client
      token = req.header("Authorization");
    }
    if (!token)
      return res.status(401).json({ msg: "Xác thực không thành công!" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
      return res.status(401).json({ msg: "Xác thực không thành công!" });

    const user = await User.findOne({ _id: decoded.id });

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
