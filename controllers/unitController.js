const ObjectId = require("mongoose").Types.ObjectId;
const Unit = require("../models/Unit");
const User = require("../models/User");

const getAllUnit = async (req, res) => {
  let { regency } = req.user;
  try {
    if (regency === "A1") {
      let units = await Unit.find({});
      res.status(200).json(units);
    } else {
      res.status(400).json({ msg: "Not allowed!" });
    }
  } catch (err) {
    console.log(`Get all unit error: ${err}`);
    res.status(400).json({ msg: "Get error" });
  }
};

const getChildUnit = async (req, res) => {
  let { username, regency } = req.user;
  try {
    let unit = await Unit.findOne({ code: username });
    let childUnit = null;
    if (regency === "A1") {
      childUnit = await Unit.find({ idParent: null });
    } else {
      childUnit = await Unit.find({ idParent: unit._id });
    }
    res.status(200).json(childUnit);
  } catch (err) {
    console.log(`Get child unit error: ${err}`);
    res.status(400).json({ msg: "Get error" });
  }
};

const getUnitById = async (req, res) => {
  let { username, regency } = req.user;
  let { idUnit } = req.params;
  try {
    let unit = await Unit.findById(idUnit);
    if (regency === "A1") {
      return res.status(200).json(unit);
    }
    let regex = new RegExp(`^${username}\\d{2}$`);
    if (regex.test(unit.code)) {
      res.status(200).json(unit);
    } else {
      res.status(400).json({ msg: "Not allowed!" });
    }
  } catch (err) {
    console.log(`Get unit error: ${err}`);
    res.status(400).json({ msg: "Get error" });
  }
};

const getVillageByWard = async (req, res) => {
  const { ward } = req.body;
  try {
    const wardCode = await Unit.find({ nameOfUnit: ward });

    if (wardCode.length !== 0) {
      let arrVillages = await Unit.find({ code: { $regex: wardCode[0].code } });

      arrVillages = arrVillages.filter((e) => e.code !== wardCode[0].code);

      res.json(arrVillages);
    } else {
      res
        .status(400)
        .json({ msg: "Không thể tìm thấy thôn bản/tổ dân phố nào phù hợp." });
    }
  } catch (err) {
    console.log(`Get unit error: ${err}`);
    res.status(400).json({ msg: "Get error" });
  }
};

const createUnit = async (req, res) => {
  const { username, regency, active } = req.user;
  const { nameOfUnit, code } = req.body;
  try {
    if (!active) {
      return res.status(400).json({ msg: 'Không trong thời gian khai báo!' })
    }
    let check = await Unit.findOne({ code: code });
    if (check) {
      return res.status(400).json({ msg: "Mã đơn vị đã tồn tại!" });
    }

    const check_nameOfUnit = await Unit.findOne({ nameOfUnit: nameOfUnit });

    if (check_nameOfUnit) {
      return res
        .status(400)
        .json({ msg: "Tên hành chính của đơn vị đã tồn tại!" });
    }
    if (regency === "A1") {
      username = "";
    }
    let regex = new RegExp(`^${username}\\d{2}$`);
    if (!regex.test(code)) {
      return res.status(400).json({ msg: "Mã đơn vị không hợp lệ!" });
    }
    let parentUnit = await Unit.findOne({ code: username });
    let newUnit = new Unit();
    newUnit.nameOfUnit = nameOfUnit;
    newUnit.code = code;
    if (parentUnit) {
      newUnit.idParent = parentUnit._id;
    } else {
      newUnit.idParent = null;
    }

    await newUnit.save();
    res.status(200).json(newUnit);
  } catch (err) {
    console.log(`Create unit error: ${err}`);
    res.status(400).json({ msg: "Create error" });
  }
};

const updateUnitById = async (req, res) => {
  let { username, regency, active } = req.user;
  let { idUnit } = req.params;
  let { nameOfUnit, code } = req.body;
  try {
    if (!active) {
      return res.status(400).json({ msg: 'Không trong thời gian khai báo!' })
    }
    let oldUnit = await Unit.findById(idUnit);
    if (!oldUnit) {
      return res.statsu(400).json({ msg: "Đơn vị không tồn tại!" });
    }
    if (regency === "A1") {
      let updatedUnit = await Unit.findByIdAndUpdate(idUnit, {
        nameOfUnit,
        code,
      });
      await User.findOneAndUpdate(
        { username: oldUnit.code },
        { username: code }
      );
      return res
        .status(200)
        .json({ msg: "Cập nhật thành công!", data: updatedUnit });
    }

    let regex = new RegExp(`^${username}\\d{2}$`);
    if (regex.test(oldUnit.code)) {
      let updatedUnit = await Unit.findByIdAndUpdate(idUnit, {
        nameOfUnit,
        code,
      });
      let user = await User.findOne({ username: oldUnit.code });
      await User.findOneAndUpdate(
        { username: oldUnit.code },
        { username: code }
      );
      res.status(200).json({ msg: "Cập nhật thành công!", data: updatedUnit });
    } else {
      res.status(400).json({ msg: "Not allowed!" });
    }
  } catch (err) {
    console.log(`Update unit error: ${err}`);
    res.status(400).json({ msg: "Update error" });
  }
};

const deleteUnitById = async (req, res) => {
  let { username, regency, active } = req.user;
  let { idUnit } = req.params;
  try {
    if (!active) {
      return res.status(400).json({ msg: 'Không trong thời gian khai báo!' })
    }
    if (regency === "A1") {
      await Unit.findByIdAndDelete(idUnit);
      return res.status(200).json({ msg: "Delete successfully" });
    }
    let oldUnit = await Unit.findById(idUnit);
    if (!oldUnit) {
      return res.status(400).json({ msg: "Invalid Unit id!" });
    }
    let regex = new RegExp(`^${username}\\d{2}$`);
    if (regex.test(oldUnit.code)) {
      await Unit.findByIdAndDelete(idUnit);
      res.status(200).json({ msg: "Delete successfully" });
    } else {
      res.status(400).json({ msg: "Not allowed!" });
    }
  } catch (err) {
    console.log(`Delete unit error: ${err}`);
    res.status(400).json({ msg: "Delete error" });
  }
};

module.exports = {
  getAllUnit,
  getChildUnit,
  getUnitById,
  createUnit,
  getVillageByWard,
  updateUnitById,
  deleteUnitById,
};
