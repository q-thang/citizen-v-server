const Citizen = require("../models/Citizen");

const citizenCtrl = {
  getAllCitizen: async (req, res) => {
    try {
      const citizens = await Citizen.find({});
      res.status(200).json(citizens);
    } catch (err) {
      console.log(`Get all citizen error: ${err}`);
      res.status(400).json({
        message: "Đã có lỗi xảy ra khi lấy thông tin của tất cả công dân.",
      });
    }
  },

  getCitizenById: async (req, res) => {
    const { idCitizen } = req.params;
    try {
      let citizen = await Citizen.findById(idCitizen);
      res.status(200).json(citizen);
    } catch (err) {
      console.log(`Get citizen error: ${err}`);
      res.status(400).json({ message: "Get error" });
    }
  },

  findCitizen: async (req, res) => {
    const { identifiedCode, phoneNumber } = req.body;

    const citizenFound = await Citizen.find({
      $or: [{ identifiedCode: identifiedCode }, { phoneNumber: phoneNumber }],
    });

    if (!citizenFound) {
      res.status(400).json({
        message: "Không thể tìm thấy công dân nào có định danh như yêu cầu.",
      });
    } else {
      res.status(200).json(citizenFound);
    }
  },

  findCitizens: async (req, res) => {
    const {
      fullName,
      dateOfBirth,
      gender,
      occupation,
      ethnic,
      religion,
      idUnit,
    } = req.body;

    const criteria = {};

    if (fullName) {
      criteria.fullName = { $regex: new RegExp(fullName, "i") };
    }

    if (gender) {
      criteria.gender = gender;
    }

    if (dateOfBirth) {
      criteria.dateOfBirth = dateOfBirth;
    }

    if (occupation) {
      criteria.occupation = { $regex: new RegExp(occupation, "i") };
    }

    if (ethnic) {
      criteria.ethnic = ethnic; // call API ---> get ethnic list in fe ----> dropdown get value
    }

    if (religion) {
      criteria.religion = religion; // dropdown get value
    }

    // if (idUnit) {
    //   criteria.idUnit = {

    //   }
    // }

    const citizensFound = await Citizen.find(criteria);

    if (!citizensFound) {
      res.status(400).json({
        message: "Không thể tìm thấy công dân nào có định danh như yêu cầu.",
      });
    } else {
      res.status(200).json(citizensFound);
    }
  },

  createCitizen: async (req, res) => {
    const {
      fullName,
      dateOfBirth,
      currentAddress,
      gender,
      phoneNumber,
      identifiedCode,
      occupation,
      ethnic,
      religion,
      idUnit,
    } = req.body;
    try {
      const newCitizen = new Citizen({
        fullName,
        dateOfBirth,
        currentAddress,
        gender,
        phoneNumber,
        identifiedCode,
        occupation,
        ethnic,
        religion,
        idUnit,
      });

      const existed_idCode = await Citizen.findOne({ identifiedCode });
      if (existed_idCode) {
        return res
          .status(400)
          .json({ msg: "Đã tồn tại công dân có CCCD này." });
      }

      const existed_phoneNumber = await Citizen.findOne({ phoneNumber });
      if (existed_phoneNumber) {
        return res
          .status(400)
          .json({ msg: "Đã tồn tại công dân có số điện thoại này." });
      }

      await newCitizen.save();
      res.status(200).json({
        msg: "Đã khai báo thành công công dân này!",
        newCitizen: newCitizen,
      });
    } catch (err) {
      console.log(`Create citizen error: ${err}`);
      res.status(400).json({
        message: "Đã có lỗi xảy ra khi tạo mới thông tin về công dân này.",
      });
    }
  },

  updateCitizenById: async (req, res) => {
    const {
      fullName,
      dateOfBirth,
      currentAddress,
      gender,
      phoneNumber,
      identifiedCode,
      occupation,
      ethnic,
      religion,
      idUnit,
    } = req.body;

    try {
      const current_citizen = await Citizen.findById(req.params.idCitizen);

      if (identifiedCode !== current_citizen.identifiedCode) {
        const existed_idCode = await Citizen.findOne({ identifiedCode });

        if (existed_idCode) {
          return res
            .status(400)
            .json({ msg: "Đã tồn tại công dân có CCCD này." });
        }
      }

      if (phoneNumber !== current_citizen.phoneNumber) {
        const existed_phoneNumber = await Citizen.findOne({ phoneNumber });

        if (existed_phoneNumber) {
          return res
            .status(400)
            .json({ msg: "Đã tồn tại công dân có số điện thoại này." });
        }
      }

      await Citizen.findByIdAndUpdate(req.params.idCitizen, {
        fullName,
        dateOfBirth,
        currentAddress,
        gender,
        phoneNumber,
        identifiedCode,
        phoneNumber,
        occupation,
        ethnic,
        religion,
        idUnit,
      });

      res.status(200).json({ msg: "Đã cập nhật thành công công dân này!" });
    } catch (err) {
      console.log(`Update citizen error: ${err}`);
      res.status(400).json({
        message: "Đã có lỗi xảy ra khi cập nhật thông tin về công dân này.",
      });
    }
  },

  deleteCitizenById: async (req, res) => {
    try {
      await Citizen.findByIdAndDelete(req.params.idCitizen);
      res.status(200).json({ msg: "Đã xoá thành công công dân này!" });
    } catch (err) {
      console.log(`Delete citizen error: ${err}`);
      res.status(400).json({
        message: "Đã có lỗi xảy ra khi xoá thông tin về công dân này.",
      });
    }
  },
};

module.exports = citizenCtrl;
