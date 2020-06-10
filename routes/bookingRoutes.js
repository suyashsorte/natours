const bookingController = require('./../controllers/bookingController');
const express = require('express');
const authcontroller = require('./../controllers/authController');
const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authcontroller.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
