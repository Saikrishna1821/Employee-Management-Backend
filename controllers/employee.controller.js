const {
  addNewEmployeeService,
  deleteEmployeeService,
  updateEmployeeService,
  getAllEmployeeService,
  dashboardCountService,
} = require("../services/employee.service");

const fetchEmployees = async (req, res) => {
  try {
    const result = await getAllEmployeeService();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const addEmployee = async (req, res) => {
  try {


    await addNewEmployeeService(req.body,req.file);

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
    });
  } catch (e) {
    if (e.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const updateEmployee = async (req, res) => {
  try {
    await updateEmployeeService(
       req.params.id,
      req.body,
      req.file
    );

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
    });
  } catch (e) {
    if (e.message === "EMPLOYEE_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (e.message === "EMPLOYEE_ID_REQUIRED") {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await deleteEmployeeService(req.params.id);
    res.status(200).json({
      success: false,
      message: "Employee deleted successfully",
    });
  } catch (e) {
    if (e.message == "EMPLOYEE_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Employee not exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getCounts = async (req, res) => {
  try {
    const result = await dashboardCountService();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getCounts,
};
