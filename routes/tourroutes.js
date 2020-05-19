const express = require('express');
const tourcontroller = require('./../controllers/tourController');
const router = express.Router();
const authController = require('./../controllers/authController');
// router.param('x', tourcontroller.checkID);

router
  .route('/top-5-cheap')
  .get(tourcontroller.aliasTopTours, tourcontroller.getalltours);

router.route('/tour-stats').get(tourcontroller.getTourStats);
router.route('/monthly-plan/:year').get(tourcontroller.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourcontroller.getalltours)
  // .post(tourcontroller.checkbody, tourcontroller.createtour);
  .post(tourcontroller.createtour);

router
  .route('/:x')
  .get(tourcontroller.gettour)
  .patch(tourcontroller.updatetour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourcontroller.deletetour
  );

module.exports = router;
