const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  });