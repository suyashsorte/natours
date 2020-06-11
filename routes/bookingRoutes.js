const bookingController = require('./../controllers/bookingController');
const express = require('express');
const authcontroller = require('./../controllers/authController');
const router = express.Router();

router.use(authcontroller.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authcontroller.restrictTo('admin', 'lead-guide'));
router
  .route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
