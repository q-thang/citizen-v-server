const router = require("express").Router();
const citizenCtrl = require("../controllers/citizenController");

router.get("/citizen", citizenCtrl.getAllCitizen);

router.post("/citizen/findCitizen", citizenCtrl.findCitizen);

router.post("/citizen/findCitizens", citizenCtrl.findCitizens);

router.get("/citizen/:idCitizen", citizenCtrl.getCitizenById);

router.post("/citizen", citizenCtrl.createCitizen);

router.patch("/citizen/:idCitizen", citizenCtrl.updateCitizenById);

router.delete("/citizen/:idCitizen", citizenCtrl.deleteCitizenById);

module.exports = router;
