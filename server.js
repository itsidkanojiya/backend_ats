const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { errorHandler } = require('./middlewares/errorHandler');
require('dotenv').config();
require('./config/passport');

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', require('./routes/authRoutes'));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
