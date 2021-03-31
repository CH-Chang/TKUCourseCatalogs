const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const courseController = require("../controllers/courseController");

router.get("/getCategory", courseController.getCategory);
router.get("/getUnitCourse", courseController.getUnitCourse);

router.get("/getSelectedCourse", courseController.getSelectedCourse);
router.get("/getPossibleInUnit", [auth], courseController.getPossibleInUnit);
router.get("/getPossibleOutUnit", [auth], courseController.getPossibleOutUnit);
router.get("/getPossibleGeneral", [auth], courseController.getPossibleGeneral);
router.get(
  "/getPossiblePhysical",
  [auth],
  courseController.getPossiblePhysical
);

module.exports = router;
