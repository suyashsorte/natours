const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION!!! SHUTTING DOWN....');

  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

console.log(app.get('env'));
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// console.log('db:->', DB);
//used to just avoid depracation warnings->
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection succesful!!!');
  });
// just for testing->
// const testTour = new Tour({
//   //object of Tour
//   name: 'The Park Camper',
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR:', err);
//   });
// const port = process.env.PORT || 3000;
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!!! SHUTTING DOWN....');
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
