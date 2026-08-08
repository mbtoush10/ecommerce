function errorHandler(err, req, res, next) {
  console.error(`[Error] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(err.stack); 

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

module.exports = errorHandler;