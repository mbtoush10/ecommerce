require("dotenv").config();
const app = require("./app");
const pool = require("./config/database"); 

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});