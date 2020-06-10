const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getalluser = factory.getAll(User);
// exports.getalluser = catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   //  filtering using mongoose way
//   // const tour = await Tour.find()
//   //   .where('duration')
//   //   .equals(5)
//   //   .where('difficulty')
//   //   .equals('easy');

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     // requestedAt: req.requestTime,
//     results: users.length,
//     data: {
//       users: users,
//     },
//   });
// });

exports.createuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined.Please use /signup',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  // 1)Create error if user POSTs(updates) password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not fot password update.Please use /updateMyPassword',
        400
      )
    );
  }
  // 2)Filtered out unwanted field name that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user data

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getuser = factory.getOne(User);

// Do Not update passwords with this
exports.updateuser = factory.updateOne(User);
exports.deleteuser = factory.deleteOne(User);
