const Tour = require('./../models/tourModel');

//exports.checkID = (req, res, next, val) => {
//console.log;
//if (req.params.id * 1 > tours.length) {
//return res.status(404).json({
//status: 'fail',
//message: 'Invalid ID',
//});
//}
//next();
//};

// exports.checkBody = (req, res, next) => {
//if (!req.body.name || !req.body.price) {
//return res.status(400).json({
//status: 'fail',
//message: 'Missing name or price',
//});
//}
//next();
//};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    //  results: tours.length,
    //  data: {
    //    tours,
    //  },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

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
};

exports.createTour = async (req, res) => {
  try {
    // const newTour =  'new Tour'({})
    // newTour.save

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
        // console.log(req.body);
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    data: {
      tour: '<update here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
};