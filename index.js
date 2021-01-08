const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/userRouter')
// using .env variables
require('dotenv').config();

const port = process.env.PORT || '6285';
const app = express();

// setup express

app.use(express.json());
app.use(cors());

// setup mongoose

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if(err) throw err;
    console.log('MongoDB connection established ..');
  }
);

// setup routes (Apis)
app.use("/users", router);

app.listen(port, () => {
  console.log(`App is starting with port ${port} ..`);
});
