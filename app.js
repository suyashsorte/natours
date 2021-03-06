const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const helmet = require('helmet');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourrouter = require('./routes/tourroutes');
const userrouter = require('./routes/userroutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewroutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');

const app = express();

app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1)GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
// Access-control-Allow-Origin
// app.use(cors({
//   origin:'https://www.natours.com'
// }))
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP header
app.use(helmet());
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit requests from API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //this is middleware because it can modify incoming data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// app.use((req, res, next) => {
//   console.log('hello from middleware');
//   next();
// });

app.use(compression());

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 2)ROUTE HANDLERS
// sent to routes directory

// 3)ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourrouter);
app.use('/api/v1/users', userrouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

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
