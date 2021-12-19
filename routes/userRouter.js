const router = require("express").Router();
const userCtrl = require("../controllers/userController");

router.get("/user/options", userCtrl.getOptions);

router.get("/user/child", userCtrl.getChildUser);

router.get("/user/monitor", userCtrl.monitorUnits);

router.get('/user/totalCitizens', userCtrl.totalCitizens);

router.get("/user/chartMonitor", userCtrl.perDateMonitor);

router.get("/user/current", userCtrl.getCurrentUser);

router.get("/user/:idUser", userCtrl.getUserById);

router.get("/user", userCtrl.getAllUser);

router.post("/user", userCtrl.createUser);

router.put("/user/:idUser", userCtrl.updateUserById);

router.delete("/user/:idUser", userCtrl.deleteUserById);

module.exports = router;
