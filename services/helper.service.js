const bcrypt = require("bcrypt");
const db = require("../config/database");
const hashPassword = async (password) => await bcrypt.hash(password, 10);
const comparePassword = async (password, hashedPassword) =>
  await bcrypt.compare(password, hashedPassword);

//To check email existance in users or employee table.
const checkEmailExists = async (email, table) => {
  const query = `SELECT * from ${table} where email=?`;
  const [data] = await db.query(query, [email]);
  return data?.length > 0;
};
module.exports = { hashPassword, checkEmailExists, comparePassword };
