const app = require('./app');
require('dotenv').config(); // Ensure environment variables are loaded

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
