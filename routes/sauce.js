const express = require("express");

const router = express.Router();

const SauceCtrl = require("../controllers/sauce");

const auth = require("../middleware/auth");

const multer = require("../middleware/multer-config");

router.get("/", auth, SauceCtrl.getAllSauce);

router.get("/:id", auth, SauceCtrl.getOneSauce);

router.post("/", auth, multer, SauceCtrl.createSauce);

router.put("/:id", auth, multer, SauceCtrl.modifySauce);

router.delete("/:id", auth, SauceCtrl.deleteSauce);

router.post("/:id/like", auth, SauceCtrl.likeSauce);

module.exports = router;
