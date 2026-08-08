const pool = require("../config/database");

async function getCategories(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, description, is_active, created_at
            FROM categories
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
      message: "Failed to retrieve categories",
    });
  }
}

async function getCategoryById(req, res) {
  try {
    const categoryId = Number(req.params.id);


    const result = await pool.query(
      "SELECT * FROM categories WHERE id = $1", // $1 عشان الامان
      [categoryId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve category",
    });
  }
}

async function createCategory(req, res) {
  try {
    const { name, description } = req.body;

    const result = await pool.query(
      `INSERT INTO categories 
       (name, description) 
       VALUES ($1, $2) 
       RETURNING *`,
      [name, description || null],
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
}

async function updateCategory(req, res) {
  try {
    const categoryId = Number(req.params.id);
    const {
      name,
      description,
      is_active,
    } = req.body;
 
    const result = await pool.query(
      `UPDATE categories
      SET name = $1,
          description = $2, 
          is_active = $3
          WHERE id = $4
          RETURNING *`,
      [
        name,
        description,
        is_active,
        categoryId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
}

async function deactivateCategory(req, res) {
  try {
    const categoryId = Number(req.params.id);

    const result = await pool.query(
      `UPDATE categories 
       SET is_active = false 
       WHERE id = $1 
       RETURNING *`,
      [categoryId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deactivated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate category",
    });
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deactivateCategory
};
