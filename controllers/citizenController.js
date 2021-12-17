const Citizen = require("../models/Citizen");

const citizenCtrl = {
  getAllCitizen: async (req, res) => {
    try {
      const citizens = await Citizen.find({});
      res.status(200).json(citizens);
    } catch (err) {
      console.log(`Get all citizen error: ${err}`);
      res.status(400).json({
        msg: "Đã có lỗi xảy ra khi lấy thông tin của tất cả công dân.",
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
      res.status(400).json({ msg: "Get error" });
    }
  },

  findCitizen: async (req, res) => {
    try {
      const { identifiedCode, phoneNumber } = req.body;

      const citizenFound = await Citizen.find({
        $or: [{ identifiedCode: identifiedCode }, { phoneNumber: phoneNumber }],
      });

      if (!citizenFound) {
        res.status(400).json({
          msg: "Không thể tìm thấy công dân nào có định danh như yêu cầu.",
        });
      } else {
        res.status(200).json(citizenFound);
      }
    } catch (err) {
      console.log(`Get citizen error: ${err}`);
      res.status(400).json({ msg: "Get error" });
    }
  },

  listCitizens: async (req, res) => {
    const { location } = req.body;

    const { city, district, ward, village } = location;

    try {
      let criteria = {};

      if (city) {
        if (city.includes(",")) {
          const cityList = city.split(",");

          criteria = {
            ...criteria,
            "location.city": { $in: cityList },
          };
        } else {
          criteria = {
            ...criteria,
            "location.city": city,
          };
        }
      }

      if (district) {
        if (district.includes(",")) {
          const districtList = district.split(",");

          criteria = {
            ...criteria,
            "location.district": { $in: districtList },
          };
        } else {
          criteria = {
            ...criteria,
            "location.district": district,
          };
        }
      }

      if (ward) {
        if (ward.includes(",")) {
          const wardList = ward.split(",");

          criteria = {
            ...criteria,
            "location.ward": { $in: wardList },
          };
        } else {
          criteria = {
            ...criteria,
            "location.ward": ward,
          };
        }
      }

      if (village) {
        if (village.includes(",")) {
          const villageList = village.split(",");

          criteria = {
            ...criteria,
            "location.village": { $in: villageList },
          };
        } else {
          criteria = {
            ...criteria,
            "location.village": village,
          };
        }
      }

      const citizensFound = await Citizen.find(criteria);

      res.json(citizensFound);
    } catch (err) {
      console.log(`Get citizen error: ${err}`);
      res.status(400).json({ msg: "Get error" });
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
      location,
    } = req.body;

    try {
      let criteria = {};

      if (location) {
        const { city, district, ward, village } = location;
        if (city) {
          criteria = {
            ...criteria,
            "location.city": city,
          };
        }

        if (district) {
          criteria = {
            ...criteria,
            "location.district": district,
          };
        }

        if (ward) {
          criteria = {
            ...criteria,
            "location.ward": ward,
          };
        }

        if (village) {
          criteria = {
            ...criteria,
            "location.village": village,
          };
        }
      }

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

      const citizensFound = await Citizen.find(criteria);

      if (!citizensFound) {
        res.status(400).json({
          msg: "Không thể tìm thấy công dân nào có định danh như yêu cầu.",
        });
      } else {
        res.status(200).json(citizensFound);
      }
    } catch (err) {
      console.log(`Get citizen error: ${err}`);
      res.status(400).json({ msg: "Get error" });
    }
  },

  createCitizen: async (req, res) => {
    let { active } = req.user;

    const {
      fullName,
      dateOfBirth,
      currentAddress,
      gender,
      email,
      residentAddress,
      educationLevel,
      phoneNumber,
      identifiedCode,
      occupation,
      ethnic,
      religion,
      location,
    } = req.body;

    try {
      if (!active) {
        return res.status(200).json({
          success: false,
          msg: "Không trong thời gian khai báo!",
        });
      }

      const newCitizen = new Citizen({
        fullName,
        dateOfBirth,
        currentAddress,
        gender,
        phoneNumber,
        email,
        residentAddress,
        educationLevel,
        identifiedCode,
        occupation,
        ethnic,
        religion,
        location,
      });

      const existed_idCode = await Citizen.findOne({ identifiedCode });

      if (existed_idCode && existed_idCode.identifiedCode !== "") {
        return res.status(200).json({
          success: false,
          msg: "Đã tồn tại công dân có CCCD này.",
        });
      }

      const existed_phoneNumber = await Citizen.findOne({ phoneNumber });

      if (existed_phoneNumber && existed_phoneNumber.phoneNumber !== "") {
        return res.status(200).json({
          sucess: false,
          msg: "Đã tồn tại công dân có số điện thoại này.",
        });
      }

      await newCitizen.save();
      res.status(200).json({
        success: true,
        msg: "Đã khai báo thành công công dân này!",
        newCitizen: newCitizen,
      });

      console.log(res);
    } catch (err) {
      console.log(`Create citizen error: ${err}`);
      res.status(400).json({
        msg: "Đã có lỗi xảy ra khi tạo mới thông tin về công dân này.",
      });
    }
  },

  updateCitizenById: async (req, res) => {
    let { active } = req.user;
    const {
      fullName,
      dateOfBirth,
      currentAddress,
      gender,
      phoneNumber,
      residentAddress,
      educationLevel,
      identifiedCode,
      occupation,
      ethnic,
      religion,
      idUnit,
    } = req.body;

    try {
      if (!active) {
        return res.status(400).json({ msg: "Không trong thời gian khai báo!" });
      }
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
        residentAddress,
        educationLevel,
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
        msg: "Đã có lỗi xảy ra khi cập nhật thông tin về công dân này.",
      });
    }
  },

  statisticAge: async (req, res) => {
    try {
      const { location } = req.body;

      const { city, district, ward, village } = location;

      let criteria = {};

      if (city) {
        if (city.includes(",")) {
          const cityList = city.split(",");

          criteria = {
            ...criteria,
            "location.city": { $in: cityList },
          };
        } else {
          criteria = {
            ...criteria,
            "location.city": city,
          };
        }
      }

      if (district) {
        if (district.includes(",")) {
          const districtList = district.split(",");

          criteria = {
            ...criteria,
            "location.district": { $in: districtList },
          };
        } else {
          criteria = {
            ...criteria,
            "location.district": district,
          };
        }
      }

      if (ward) {
        if (ward.includes(",")) {
          const wardList = ward.split(",");

          criteria = {
            ...criteria,
            "location.ward": { $in: wardList },
          };
        } else {
          criteria = {
            ...criteria,
            "location.ward": ward,
          };
        }
      }

      if (village) {
        if (village.includes(",")) {
          const villageList = village.split(",");

          criteria = {
            ...criteria,
            "location.village": { $in: villageList },
          };
        } else {
          criteria = {
            ...criteria,
            "location.village": village,
          };
        }
      }

      const citizensFound = await Citizen.find(criteria).select(
        "gender dateOfBirth"
      );

      const mapCitizen = citizensFound.map((e) => ({
        dateOfBirth: e.dateOfBirth,
        _id: e._id,
        gender: e.gender,
        age: new Date().getFullYear() - parseInt(e.dateOfBirth.slice(-4)),
      }));

      let statisticAge = {};

      mapCitizen.forEach((e) => {
        for (let i = 0; i <= 100; i += 5) {
          if (e.age >= i && e.age <= i + 4) {
            const str = i;
            if (!statisticAge.hasOwnProperty(str)) {
              statisticAge = {
                ...statisticAge,
                [str]: {
                  sumMale: 0,
                  sumFemale: 0,
                },
              };
            } else {
              statisticAge = {
                ...statisticAge,
              };
            }
            if (e.gender === "Nam") {
              statisticAge[str].sumMale++;
            } else if (e.gender === "Nữ") {
              statisticAge[str].sumFemale++;
            }
            break;
          }
        }
      });

      for (let [key, value] of Object.entries(statisticAge)) {
        statisticAge = {
          ...statisticAge,
          [key]: {
            ...statisticAge[key],
            countCitizens: value.sumFemale + value.sumMale,
          },
        };
      }

      const sortObject = (obj) =>
        Object.fromEntries(Object.entries(obj).sort((a, b) => a - b));

      statisticAge = sortObject(statisticAge);

      res.json(statisticAge);
    } catch (err) {
      console.log(`Delete citizen error: ${err}`);
      res.status(400).json({
        msg: "Đã có lỗi xảy ra khi xoá thông tin về công dân này.",
      });
    }
  },

  deleteCitizenById: async (req, res) => {
    let { active } = req.user;
    try {
      if (!active) {
        return res.status(400).json({ msg: "Không trong thời gian khai báo!" });
      }
      await Citizen.findByIdAndDelete(req.params.idCitizen);
      res.status(200).json({ msg: "Đã xoá thành công công dân này!" });
    } catch (err) {
      console.log(`Delete citizen error: ${err}`);
      res.status(400).json({
        msg: "Đã có lỗi xảy ra khi xoá thông tin về công dân này.",
      });
    }
  },
};

module.exports = citizenCtrl;
