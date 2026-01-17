const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkEmailExists, comparePassword, hashPassword } = require("./helper.service");
const LoginService = async ({ email, password }) => {
  const query = "SELECT * from users where email=?";
  const [user] = await db.query(query, [email]);
  if (user.length == 0) throw new Error("Invalid email or password");
  const isValidPassword = await comparePassword(
    password,
    user[0].password_hash
  );
  if (isValidPassword) {
    const data = {
      user_id: user[0].user_id,
      role: user[0].role,
    };
    const token = await jwt.sign(data, process.env.SECRETKEY, {
      expiresIn: 5 * 60 * 60,
    });
    return token;
  } else throw new Error("Incorrect Password");
};

const RegistrationService = async (data) => {
  const { username, email, password, role = "ADMIN" } = data;
  const isEmailExists = await checkEmailExists(email, "users");

  if (isEmailExists) {
    throw new Error("emailExists");
  } else {
    const password_hash = await hashPassword(password);
    const query =
      "INSERT into users (name,email,password_hash,role) VALUES(?,?,?,?) ";

    const [result] = await db.query(query, [
      username,
      email,
      password_hash,
      role,
    ]);
    if (result.affectedRows > 0) {
      return true;
    } else throw err;
  }
};

module.exports = { LoginService, RegistrationService };
