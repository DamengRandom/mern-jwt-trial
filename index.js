const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');
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

app.use("/user", userRouter);
app.use("/todos", todoRouter);

app.listen(port, () => {
  console.log(`App is starting with port ${port} ..`);
});
