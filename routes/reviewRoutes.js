const reviewController = require('./../controllers/reviewController');
const express = require('express');
const authcontroller = require('./../controllers/authController');
const router = express.Router({ mergeParams: true }); //this will help pass the tourid while getting redirected from /tours
// will work for both routes
// POST /tour/123asd(tourid)/reviews
// POST /reviews

router.use(authcontroller.protect);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authcontroller.restrictTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authcontroller.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authcontroller.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );
module.exports = router;
