const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

//check a checkbody middleware
//check if budy contains the name and price property
//if not, send back 400(bad request)
//Add it to tue post Handler Stack

// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
