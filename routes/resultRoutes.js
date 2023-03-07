const express = require('express');
const resultController = require('./../controllers/resultController');
const authController = require('./../controllers/authController');

const router = express.Router();

//check a checkbody middleware
//check if budy contains the name and price property
//if not, send back 400(bad request)
//Add it to tue post Handler Stack

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(resultController.aliasTopResults, resultController.getAllResults);

router.route('/result-stats').get(resultController.getResultStats);
router.route('/monthly-plan/:year').get(resultController.getMonthlyPlan);

router
  .route('/get')
  .get(authController.protect, resultController.getAllResults);
router.route('/post').post(resultController.createResult);

router.route('/get/:id').get(resultController.getResult);
router.route('/update/:id').patch(resultController.updateResult);
router
  .route('/delete/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'moderator'),
    resultController.deleteResult
  );

module.exports = router;
