const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const dotenv = require('dotenv');

const userRoutes = require('./routes/user.routes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.CON_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => console.log('Connected to MongoDB'),
    err => console.log(err.message)
  );

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/users', userRoutes);
app.all('*', (req, res, next) => {
  next(createError(404, `Can't find ${req.originalUrl} on this server`));
});
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
