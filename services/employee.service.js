const e = require("express");
const db = require("../config/database");

const getAllEmployeeService = async () => {
  const query = `
    SELECT
      e.id,
      e.employee_code,
      e.full_name,
      e.email,
      e.gender,
      e.dob,
      e.state,
      e.is_active,
      ei.image_url
    FROM employees e
    LEFT JOIN employee_images ei
      ON e.id = ei.emp_id
    ORDER BY e.created_at DESC
  `;
  const rows = await db.query(query);

  return rows[0].map((emp) => {
    if (emp.image_url) {
      const base64 = Buffer.from(emp.image_url).toString("base64");
      emp.image_url = `data:image/jpeg;base64,${base64}`;
    }
    return emp;
  });
};
const addNewEmployeeService = async (data, file) => {
  const { email, name, gender, dob, state, active } = data;
 
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const isActive =
      active === true || active === "true" || active === 1 || active === "1"
        ? 1
        : 0;

    // 1️⃣ Insert employee
    const insertEmployeeQuery = `
      INSERT INTO employees 
      (email, full_name, gender, dob, state, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [employeeResult] = await connection.query(insertEmployeeQuery, [
      email,
      name,
      gender,
      dob,
      state,
      isActive ?? 1,
    ]);

    const empId = employeeResult.insertId;

    // 2️⃣ Generate employee code
    const employee_code = `EMP-${String(empId).padStart(2, "0")}`;
    await connection.query("UPDATE employees SET employee_code=? WHERE id=?", [
      employee_code,
      empId,
    ]);

    // 3️⃣ Insert image
    if (file) {
      const insertImageQuery = `
        INSERT INTO employee_images (emp_id, image_url,mime_type)
        VALUES (?, ?,?)
      `;
      await connection.query(insertImageQuery, [
        empId,
        file.buffer,
        file.mimetype,
      ]);
    }

    await connection.commit();
    return true;
  } catch (err) {
    await connection.rollback();

    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("EMAIL_EXISTS");
    }

    throw err;
  } finally {
    connection.release();
  }
};

const deleteEmployeeService = async (id) => {
  const query = "delete from employees where id=?";
  const result = await db.query(query, [id]);
  if (result.affectedRows == 0) throw new Error("EMPLOYEE_NOT_FOUND");
  return true;
};
const updateEmployeeService = async (id, data, file) => {
  const { name, gender, dob, state, active } = data;

  const isActive =
    active === true || active === "true" || active === 1 || active === "1"
      ? 1
      : 0;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Update employee details
    const updateEmployeeQuery = `
      UPDATE employees
      SET 
        full_name = ?,
        gender = ?,
        dob = ?,
        state = ?,
        is_active = ?
      WHERE id = ?
    `;

    const [result] = await connection.query(updateEmployeeQuery, [
      name,
      gender,
      dob,
      state,
      isActive,
      id,
    ]);

    if (result.affectedRows === 0) {
      throw new Error("EMPLOYEE_NOT_FOUND");
    }

    // 2️⃣ Update image if provided
    if (file) {
      const updateImageQuery = `
       INSERT INTO employee_images (image_url,mime_type,emp_id)
       VALUES (?,?,?)
       ON DUPLICATE KEY UPDATE 
        image_url = VALUES(image_url) , mime_type=VALUES(mime_type)
      `;
      await connection.query(updateImageQuery, [
        file.buffer,
        file.mimetype,
        id,
      ]); 
    }

    await connection.commit();
    return true;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const dashboardCountService = async () => {
  let query = `SELECT
  COUNT(*) AS total_count,
  SUM(is_active = 0) AS inactive,
  SUM(is_active = 1) AS active
FROM employees`;
  const [rows] = await db.query(query);

  const stats = rows[0] || {
    total_count: 0,
    inactive: 0,
    active: 0,
  };

  return stats;
};
module.exports = {
  getAllEmployeeService,
  addNewEmployeeService,
  deleteEmployeeService,
  updateEmployeeService,
  dashboardCountService, //will remove later
};
