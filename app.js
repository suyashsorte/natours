const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourrouter = require('./routes/tourroutes');
const userrouter = require('./routes/userroutes');
const app = express();

// 1)MIDDLEWARES
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); //this is middleware because it can modify incoming data

app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('hello from middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// 2)ROUTE HANDLERS
// sent to routes directory

// 3)ROUTE

app.use('/api/v1/tours', tourrouter);
app.use('/api/v1/users', userrouter);

// if the above middleware routes are not macthed then only below code will execute
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
}); //handle all urls like get,post etc

app.use(globalErrorHandler);

// 4)START SERVER
module.exports = app;
