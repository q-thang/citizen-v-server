const router = require("express").Router();
const unitCtrl = require("../controllers/unitController");

router.get("/unit/", unitCtrl.getAllUnit);

router.get("/unit/child", unitCtrl.getChildUnit);

router.get("/unit/code/:code", unitCtrl.getUnitByCode);

router.get("/unit/:idUnit", unitCtrl.getUnitById);

router.post("/unit/getVillage", unitCtrl.getVillageByWard);

router.post("/unit/", unitCtrl.createUnit);

router.put("/unit/status/:idUnit", unitCtrl.updateStatus);

router.put("/unit/:idUnit", unitCtrl.updateUnitById);

router.delete("/unit/:idUnit", unitCtrl.deleteUnitById);

module.exports = router;
