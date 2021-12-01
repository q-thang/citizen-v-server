const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");

// @route POST /api/register
// @desc Register (Create an account for an Official)
// @access Private
router.post("/register", authCtrl.register);

// @route POST /api/login
// @desc Login to the Official Account
// @access Public
router.post("/login", authCtrl.login);

// @route POST /api/logout
// @desc Logout of the Official Account
// @access Private
router.post("/logout", authCtrl.logout);

// @route POST /api/refresh_token
// @desc Generate the access token & Refresh the token of an account
// @access Private
router.post("/refresh_token", authCtrl.generateAccessToken);

module.exports = router;
