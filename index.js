const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/userRouter')
// using .env variables
require('dotenv').config();

const port = process.env.PORT || '6285';
const app = express();

// setup express

app.use(express.json()); // json body parser (read response as json format)
app.use(cors());

// setup mongoose

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if(err) throw err;
    console.log('MongoDB connection established ..');
  }
);

// setup routes (Apis)

app.use("/user", router);

app.listen(port, () => {
  console.log(`App is starting with port ${port} ..`);
});
