require("dotenv").config();
const db = require("./config/database");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const empRoutes = require("./routes/employee.route");
const { verifyToken } = require("./middlewares/auth.middleware");
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://employee-management-8e8gpnuf4-saikrishna-mummadis-projects.vercel.app"
  ],
  credentials: true
}));
app.use("/uploads", express.static("uploads"));



app.get("/api/health", (req, res) => {
  console.log("health check");
  res.json("success");
});

app.use("/api/auth", authRoutes);
app.use(verifyToken);
app.use("/api/employee", empRoutes);

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Database is successfully connected");
    connection.release();

    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  } catch (err) {
    process.exit(1);
  }
})();
