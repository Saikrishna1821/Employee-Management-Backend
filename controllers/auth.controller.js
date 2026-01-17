const {
  LoginService,
  RegistrationService,
} = require("../services/user.service");

const login = async (req, res) => {
  try {
    const result = await LoginService(req.body);
    res.status(201).json({
      success: true,
      message: "Login Successfull",
      token: result,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Invalid email or password",
    });
  }
};
const register = async (req, res) => {
  try {
    const result = await RegistrationService(req.body);
    res.status(201).json({
      success: true,
      message: "Registration Successfull",
    });
  } catch (e) {
    //Hiding SQL response error to avoid attacks
    const error =
      e.message == "emailExists"
        ? "Email Already Exists"
        : "Something Went Wrong..!";
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = { login, register };
