const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.hf6wvvm.mongodb.net/`,
  () => {
    console.log('connected to mongodb');
  }
);
