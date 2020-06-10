const express = require('express');
const tourcontroller = require('./../controllers/tourController');
const router = express.Router();
const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');
// router.param('x', tourcontroller.checkID);

router
  .route('/top-5-cheap')
  .get(tourcontroller.aliasTopTours, tourcontroller.getalltours);

router.route('/tour-stats').get(tourcontroller.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourcontroller.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourcontroller.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourcontroller.getDistances);

router
  .route('/')
  .get(tourcontroller.getalltours)
  // .post(tourcontroller.checkbody, tourcontroller.createtour);
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourcontroller.createtour
  );

router
  .route('/:id')
  .get(tourcontroller.gettour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourcontroller.uploadTourImages,
    tourcontroller.resizeTourImages,
    tourcontroller.updatetour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourcontroller.deletetour
  );

router.use('/:tourId/reviews', reviewRouter);
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
module.exports = router;
