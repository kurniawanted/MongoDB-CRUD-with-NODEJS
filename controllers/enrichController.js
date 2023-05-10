const Enrich = require('./../models/enrichModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopEnrichs = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-nama,alamat';
  req.query.fields = 'nama,alamat,noTelp,url,segment';
  next();
};

exports.getAllEnrichs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Enrich.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const enrichs = await features.query;

  // send response

  res.status(200).json({
    status: 'success',
    enrichs: enrichs.length,
    data: {
      enrichs,
    },
  });
});

exports.getEnrich = catchAsync(async (req, res, next) => {
  //console.log(req.params);
  // const id = req.params.id * 1;
  const enrich = await Enrich.findById(req.params.id);

  if (!enrich) {
    return next(new AppError('No enrich found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      enrich,
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

exports.createEnrich = catchAsync(async (req, res, next) => {
  const newEnrich = await Enrich.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      enrich: newEnrich,
      // console.log(req.body);
    },
  });
});

exports.updateEnrich = catchAsync(async (req, res, next) => {
  const enrich = await Enrich.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!enrich) {
    return next(new AppError('No enrich found with that ID', 404));
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      enrich,
    },
  });
});

exports.deleteEnrich = catchAsync(async (req, res, next) => {
  const enrich = await Enrich.findByIdAndDelete(req.params.id);

  if (!enrich) {
    return next(new AppError('No enrich found with that ID', 404));
  }

  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});

exports.getEnrichStats = catchAsync(async (req, res, next) => {
  const stats = await Enrich.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$rating' },
        numEnrich: { $sum: 1 },
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

  const plan = await Enrich.aggregate([
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
        numEnrichStarts: { $sum: 1 },
        enrichs: { $push: 'nama' },
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
      $sort: { numEnrichStarts: -1 },
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
