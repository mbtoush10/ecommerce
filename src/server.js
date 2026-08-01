require("dotenv").config();
const app = require("./app");
const pool = require("./config/database"); // استدعاء ملف الاتصال بقاعدة البيانات

const PORT = process.env.PORT || 3000;

// دالة فحص الاتصال 
async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");
    console.log("Database connected successfully");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

testDatabaseConnection(); // تشغيل الفحص

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});