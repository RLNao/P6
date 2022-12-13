const express = require("express");
const router = express.Router();
const ctrlEmail = require("../middleware/ctrlEmail");
const ctrlPassword = require("../middleware/ctrlPassword");

const userCtrl = require("../controllers/user");

router.post("/signup", ctrlPassword, ctrlEmail, userCtrl.signup);
router.post("/login", ctrlEmail, userCtrl.login);

module.exports = router;
