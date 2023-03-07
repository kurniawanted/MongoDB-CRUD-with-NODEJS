const Result = require('./../models/resultModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopResults = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-nama,alamat';
  req.query.fields = 'nama,alamat,noTelp,url,segment';
  next();
};

exports.getAllResults = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Result.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const results = await features.query;

  // send response

  res.status(200).json({
    status: 'success',
    results: results.length,
    data: {
      results,
    },
  });
});

exports.getResult = catchAsync(async (req, res, next) => {
  //console.log(req.params);
  // const id = req.params.id * 1;
  const result = await Result.findById(req.params.id);

  if (!result) {
    return next(new AppError('No result found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

//  const tour = tours.find((el) => el.id === id);

// if (id > tours.length){
//  if (!tour) {
//    return res.status(404).json({
//      status: 'fail',
//      message: 'Invalid ID',
//    });
//  }

//  res.status(200).json({
//    status: 'success',
//    data: {
//      tour,
//    },
//  });

exports.createResult = catchAsync(async (req, res, next) => {
  const newResult = await Result.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      result: newResult,
      // console.log(req.body);
    },
  });
});

exports.updateResult = catchAsync(async (req, res, next) => {
  const result = await Result.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    return next(new AppError('No result found with that ID', 404));
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      result,
    },
  });
});

exports.deleteResult = catchAsync(async (req, res, next) => {
  const result = await Result.findByIdAndDelete(req.params.id);

  if (!result) {
    return next(new AppError('No result found with that ID', 404));
  }

  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});

exports.getResultStats = catchAsync(async (req, res, next) => {
  const stats = await Result.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$rating' },
        numResult: { $sum: 1 },
        review: { $rev: '$review' },
        rating: { $rat: '$rating' },
        segment: { $seg: '$seg' },
        regional: { $reg: '$reg' },
      },
    },
  ]);

  res.status(200).json({
    status: 'sucess',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Result.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numResultStarts: { $sum: 1 },
        results: { $push: 'nama' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numResultStarts: -1 },
    },
    {
      $limit: 6,
    },
  ]);

  res.status(200).json({
    status: 'sucess',
    data: {
      plan,
    },
  });
});
