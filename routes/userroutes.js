const express = require('express');
const usercontroller = require('./../controllers/usercontroller');
const authcontroller = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const router = express.Router();

router.post('/signup', authcontroller.signup);
router.post('/login', authcontroller.login);
router.get('/logout', authcontroller.logout);
router.post('/forgotpassword', authcontroller.forgotPassword);
router.patch('/resetpassword/:token', authcontroller.resetPassword);
// midddleware functions runs in sequence. So after this point all the routes will first pass through authcontroller/protect
router.use(authcontroller.protect);

router.patch('/updateMyPassword', authcontroller.updatePassword);
router.get('/me', usercontroller.getMe, usercontroller.getuser);
router.patch('/updateMe', usercontroller.updateMe);
router.delete('/deleteMe', usercontroller.deleteMe);

router.use(authcontroller.restrictTo('admin'));
router
  .route('/')
  .get(usercontroller.getalluser)
  .post(usercontroller.createuser);

router
  .route('/:id')
  .get(usercontroller.getuser)
  .patch(usercontroller.updateuser)
  .delete(usercontroller.deleteuser);

module.exports = router;
