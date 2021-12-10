const User = require("../models/User");
const bcript = require("bcrypt");
const { getChildRegency } = require("../functions");
const Unit = require("../models/Unit");
const location = require("../data/location.json");
const Citizen = require("../models/Citizen");

const getAllUser = async (req, res) => {
  let { regency } = req.user;
  try {
    if (regency === "A1") {
      let users = await User.find({});
      users = users.map((u) => ({ ...u._doc, password: null }));
      res.status(200).json(users);
    }
  } catch (err) {
    console.log(`Get all user error: ${err}`);
    res.status(400).json({ message: "Get error" });
  }
};

const getChildUser = async (req, res) => {
  let { username, regency } = req.user;
  try {
    if (regency === "A1") {
      username = "";
    }
    let childRegency = getChildRegency(regency);
    let users = await User.find({
      username: { $regex: username + ".*" },
      regency: childRegency,
    });
    users = users.map((u) => ({ ...u._doc, password: null }));
    res.status(200).json(users);
  } catch (err) {
    console.log(`Get child user error: ${err}`);
    res.status(400).json({ message: "Get error" });
  }
};

const getUserById = async (req, res) => {
  let { username, regency } = req.user;
  let { idUser } = req.params;
  try {
    let user = await User.findById(idUser);
    if (regency === "A1") {
      return res.status(200).json(user);
    }
    let regex = new RegExp(`^${username}\\d{2}$`);
    let child_regency = getChildRegency(regency);
    if (regex.test(user.username) && user.regency === child_regency) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ msg: "Not allowed!" });
    }
  } catch (err) {
    console.log(`Get user error: ${err}`);
    res.status(400).json({ message: "Invalid Id user!" });
  }
};

const createUser = async (req, res) => {
  let { regency, active } = req.user;
  let parent_username = req.user.username;
  let { username, password } = req.body;
  try {
    if (!active) {
      return res.status(400).json({ msg: "Không trong thời gian khai báo!" });
    }
    let newRegency = getChildRegency(regency);

    if (username && password) {
      let checkName = await User.findOne({ username });
      if (checkName) {
        return res.status(400).json({ message: "Tên tài khoản đã tồn tại!" });
      }
      if (regency !== "A1") {
        let regex = new RegExp(`^${parent_username}\\d{2}$`);

        if (!regex.test(username)) {
          return res.status(400).json({ msg: "Tên tài khoản không hợp lệ!" });
        }
      }
      password = await bcript.hash(password, 10);
      let newUser = new User();
      newUser.username = username;
      newUser.password = password;
      newUser.regency = newRegency;
      newUser.active = true;
      await newUser.save();
      res.status(200).json({
        ...newUser._doc,
        password: null,
      });
    }
  } catch (err) {
    console.log(`Create user error: ${err}`);
    res.status(400).json({ message: "Create error" });
  }
};

const updateUserById = async (req, res) => {
  let { username, regency } = req.user;
  let pActive = req.user.active
  let { idUser } = req.params;
  let { newPassword, active, startTime, endTime } = req.body;
  try {
    if (!pActive) {
      return res.status(400).json({ msg: "Không trong thời gian khai báo!" });
    }
    let user = await User.findById(idUser);
    if (regency !== "A1") {
      let regex = new RegExp(`^${username}\\d{2}$`);
      if (!regex.test(user.username)) {
        return res.status(400).json({ msg: "Not allowed!" });
      }
    }

    if (newPassword && newPassword !== null) {
      newPassword = await bcript.hash(newPassword, 10);
    } else {
      newPassword = undefined;
    }
    if (startTime === null) {
      startTime = undefined;
    }
    if (endTime === null) {
      endTime = undefined;
    }
    let dataUser = {
      password: newPassword,
      active,
      startTime,
      endTime,
    };
    let updatedUser = await User.findByIdAndUpdate(idUser, dataUser);
    await User.updateMany(
      { username: { $regex: updatedUser.username + ".*" } },
      { active, startTime, endTime }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log(`Update user error: ${err}`);
    res.status(400).json({ message: "Update error" });
  }
};

const deleteUserById = async (req, res) => {
  let { username, regency, active } = req.user;
  let { idUser } = req.params;
  try {
    if (!active) {
      return res.status(400).json({ msg: "Không trong thời gian khai báo!" });
    }
    let user = await User.findById(idUser);
    if (regency !== "A1") {
      let regex = new RegExp(`^${username}\\d{2}$`);
      if (!regex.test(user.username)) {
        return res.status(400).json({ msg: "Not allowed!" });
      }
    }
    await User.findByIdAndDelete(idUser);
    res.status(200).json({ message: "Delete successfully!" });
  } catch (err) {
    console.log(`Delete user error: ${err}`);
    res.status(400).json({ message: "Invalid Id user!" });
  }
};

const getOptions = async (req, res) => {
  let { username, regency } = req.user;
  try {
    let options = null;
    if (regency === "A1") {
      options = location.map((x) => x.label);
    } else if (regency === "A2") {
      let city = await Unit.findOne({ code: username });
      let temp = location.filter((x) => x.label === city.nameOfUnit)[0][
        "Districts"
      ];
      options = temp.map((x) => x.label);
    } else if (regency === "A3") {
      let city = await Unit.findOne({ code: username.slice(0, 2) });
      let district = await Unit.findOne({ code: username.slice(0, 4) });
      let temp = location.filter((x) => x.label === city.nameOfUnit)[0][
        "Districts"
      ];
      temp = temp.filter((x) => x.label === district.nameOfUnit)[0]["Wards"];
      options = temp.map((x) => x.label);
    }

    return res.status(200).json(options);
  } catch (err) {
    console.log(`Get options error: ${err}`);
    res.status(400).json({ message: "Get options error!" });
  }
};

const monitorUnits = async (req, res) => {
  try {
    const typeCurrent = req.user.regency;

    const queryUnit = req.query.unit;
    let typeUnit = "";

    if (typeCurrent === "A1") {
      typeUnit = "location.city";
    } else if (typeCurrent === "A2") {
      typeUnit = "location.district";
    } else if (typeCurrent === "A3") {
      typeUnit = "location.ward";
    } else if (typeCurrent === "B1") {
      typeUnit = "location.village";
    }

    const countCitizens = await Citizen.aggregate([
      { $match: { [typeUnit]: queryUnit } },
      { $count: "count_citizens" },
    ]);

    if (countCitizens.length !== 0) {
      res.json(countCitizens[0].count_citizens);
    } else {
      res.json(0);
    }
  } catch (err) {
    console.log(`Delete user error: ${err}`);
    res.status(400).json({ message: "Invalid!" });
  }
};

const perDateMonitor = async (req, res) => {
  try {
    const typeCurrent = req.user.regency;

    const queryUnit = req.query.unit;
    let typeUnit = "";

    if (typeCurrent === "A1") {
      typeUnit = "location.city";
    } else if (typeCurrent === "A2") {
      typeUnit = "location.district";
    } else if (typeCurrent === "A3") {
      typeUnit = "location.ward";
    } else if (typeCurrent === "B1") {
      typeUnit = "location.village";
    }

    const perDateCitizens = await Citizen.aggregate([
      { $match: { [typeUnit]: queryUnit } },
      {
        $project: {
          dateGroup: {
            $dateToString: { format: "%d/%m/%Y", date: "$createdAt" },
          },
        },
      },
      {
        $group: {
          _id: { createdAt: "$dateGroup" },
          numberOfCitizens: { $sum: 1 },
        },
      },

      {
        $addFields: {
          createdAt: "$_id.createdAt",
        },
      },
      {
        $project: {
          _id: false,
        },
      },
    ]);

    res.json(perDateCitizens);
  } catch (err) {
    console.log(`Delete user error: ${err}`);
    res.status(400).json({ message: "Invalid!" });
  }
};

module.exports = {
  getAllUser,
  getChildUser,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  getOptions,
  monitorUnits,
  perDateMonitor,
};
