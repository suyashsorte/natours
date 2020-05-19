// const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
// const tour = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   // console.log(typeof (req.params.x * 1), typeof tour.length);

//   if (req.params.x * 1 > tour.length) {
//     console.log('enye');
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// exports.checkbody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getalltours = catchAsync(async (req, res, next) => {
  // try {
  // console.log(req.query);
  // BUILD A QUERY
  //1A)Filtering
  // const queryObj = { ...req.query }; //creating deep copy of the the query by creating the object
  // //now excluding the below words in query to make search as these fields are not paraeters in the data
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // hard coding the filter
  // const tour = await Tour.find({
  //   duration: 5,
  //   difficulty: 'easy',
  // });

  // filtering using postman query in 'url'
  // 1B)Advance filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //using regex to match,  \b is to get exact match, /g is to match multiple times
  // console.log(JSON.parse(queryStr));
  // let query = Tour.find(JSON.parse(queryStr)); //storing the filtered data

  // 2)Sorting
  // sorting the filtered data
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' '); //this is used to handle sorting if there is a tie.
  //   console.log(sortBy);
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt'); //setting default for sorting, - means descending order
  // }

  //3)Field Limiting
  //limiting the filtered,sorted data
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v'); //- means exclude a field
  // }

  //PAGINATION
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error('This page does not exist');
  // }

  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tour = await features.query;
  //  filtering using mongoose way
  // const tour = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    // requestedAt: req.requestTime,
    results: tour.length,
    data: {
      tours: tour,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.gettour = catchAsync(async (req, res, next) => {
  //app.get('/api/v1/tours/:x/:y/:d?'--for mutliple params. adding ? makes it optional.
  // console.log(req.params, '----');
  // const id = req.params.x * 1;
  //   console.log('id', id);

  // const tourid = tour.find(el => el.id === id);

  //   console.log(tourid);
  //   if (id > tour.length) {
  //or

  //   console.log(tourid);

  // res.status(200).json({
  //   status: 'success',

  //   data: {
  //     tours: tourid
  //   }
  // });

  // try {
  //Tour.findOne({_id:req.params.x}) -->previous approach
  const tour = await Tour.findById(req.params.x);
  if (!tour) {
    //if tourid not found go to error class
    return next(new AppError('No tour found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
// better way to handle error than catch block. as we know the below functions are async functions which return a promise, if there is an error that promise is rejected.so we can catch that error here.this code is then transefeerd to utils/catchAsync
// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
//   // fn(req, res, next).catch((err) => next(err));
// };

exports.createtour = catchAsync(async (req, res, next) => {
  // console.log(req.body); //.body is availble because of usage of middleware
  //   console.log(tour[tour.length - 1], tour[tour.length - 1].id);
  // const newId = tour[tour.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // //   console.log(newId);
  // //   console.log(newTour);
  // tour.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tour),
  //   err => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour
  //       }
  //     });
  //   }
  // );
  //   res.send('done');

  //previous way to create mongoose newtour object and save it
  // const newTour=new Tour({});
  // newTour.save()

  //new way
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err,
  //   });
  // }
});

exports.updatetour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findByIdAndUpdate(req.params.x, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    //if tourid not found go to error class
    return next(new AppError('No tour found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.deletetour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findByIdAndDelete(req.params.x);
  if (!tour) {
    //if tourid not found go to error class
    return next(new AppError('No tour found with that id', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
// Aggregation pipelines in mongodb example
// https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/
exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1;
  // console.log(year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        //match is just to query and select
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, //$month gives an integer value to month given the Date
        numTourStarts: { $sum: 1 }, //counting the number of data which satisfies the above conditions
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        // $project is used stop passing certain attributes to the next pipeline
        _id: 0, // 0 means not display
      },
    },
    {
      $sort: { numTourStarts: -1 }, // finally descending order sorting based on number of tours in a month
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
