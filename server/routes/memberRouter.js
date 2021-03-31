const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const memberController = require("../controllers/memberController");

router.get("/getRegisterRes", memberController.getRegisterRes);
router.get("/getEditRes", memberController.getEditRes);
router.get("/getUserInfo", [auth], memberController.getUserInfo);
router.get("/logout", memberController.logout);

router.post("/getCaptcha", memberController.getCaptcha);
router.post("/editInfo", [auth], memberController.editInfo);
router.post("/editPassword", [auth], memberController.editPassword);
router.post("/register", memberController.register);
router.post("/login", memberController.login);

module.exports = router;
