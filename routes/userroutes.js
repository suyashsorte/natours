const express = require('express');
const usercontroller = require('./../controllers/usercontroller');
const authcontroller = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authcontroller.signup);
router.post('/login', authcontroller.login);
router.post('/forgotpassword', authcontroller.forgotPassword);
router.patch('/resetpassword/:token', authcontroller.resetPassword);
router.patch(
  '/updateMyPassword',
  authcontroller.protect,
  authcontroller.updatePassword
);

router.patch('/updateMe', authcontroller.protect, usercontroller.updateMe);
router.delete('/deleteMe', authcontroller.protect, usercontroller.deleteMe);
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
