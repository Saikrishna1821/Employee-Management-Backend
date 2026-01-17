const express = require("express");
const {
  fetchEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
  getCounts,
} = require("../controllers/employee.controller");
const { upload } = require("../middlewares/uploads.middleware");
const router = express.Router();


router.post("/add", upload.single("image"), addEmployee);
router.put("/update/:id", upload.single("image"), updateEmployee);

router.get("/", fetchEmployees);
// router.post("/add", addEmployee);
router.put("/delete/:id", deleteEmployee);
// router.put("/update/:id", updateEmployee);
router.get("/dashboard", getCounts);

module.exports = router;
