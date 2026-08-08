const pool = require("../config/database");

async function getUsers(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, role, is_active, created_at 
       FROM users 
       ORDER BY id DESC`,
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
}

async function getUserById(req, res) {
  try {
    const userId = Number(req.params.id);

    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only access your own data",
      });
    }

    const result = await pool.query(
      "SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE id = $1",
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
    });
  }
}

async function updateUserStatus(req, res) {
  try {
    const userId = Number(req.params.id);
    const { is_active } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET is_active = $1 
       WHERE id = $2 
       RETURNING id, full_name, email, is_active`,
      [is_active, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
};
