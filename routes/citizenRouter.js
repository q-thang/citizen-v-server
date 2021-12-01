const router = require("express").Router();
const citizenCtrl = require("../controllers/citizenController");

// @route GET /api/citizen
// @desc Get the info of all citizens
// access Private
router.get("/citizen", citizenCtrl.getAllCitizen);


// @route POST /api/citizen/findCitizen
// @desc Find the only one citizen by ID code and Phone number
// access Private
router.post("/citizen/findCitizen", citizenCtrl.findCitizen);


// @route POST /api/citizen/findCitizens
// @desc Find citizens by some filters
// access Private
router.post("/citizen/findCitizens", citizenCtrl.findCitizens);


// @route GET /api/citizen/:idCitizen
// @desc Find the only one citizen by ID code
// access Private
router.get("/citizen/:idCitizen", citizenCtrl.getCitizenById);


// @route POST /api/citizen
// @desc Add the info of a citizen into DB
// access Private
router.post("/citizen", citizenCtrl.createCitizen);


// @route PATCH /api/citizen/:idCitizen
// @desc Update the info of a citizen by ID code
// access Private
router.patch("/citizen/:idCitizen", citizenCtrl.updateCitizenById);


// @route DELETE /api/citizen/:idCitizen
// @desc Remove a citizen
// access Private
router.delete("/citizen/:idCitizen", citizenCtrl.deleteCitizenById);

module.exports = router;
