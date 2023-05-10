const express = require('express');
const enrichController = require('./../controllers/enrichController');
// const authController = require('./../controllers/authController');

const router = express.Router();

//check a checkbody middleware
//check if budy contains the name and price property
//if not, send back 400(bad request)
//Add it to tue post Handler Stack

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(enrichController.aliasTopEnrichs, enrichController.getAllEnrichs);

router.route('/enrich-stats').get(enrichController.getEnrichStats);
router.route('/monthly-plan/:year').get(enrichController.getMonthlyPlan);

router.route('/get').get(enrichController.getAllEnrichs);
router.route('/post').post(enrichController.createEnrich);

router.route('/get/:id').get(enrichController.getEnrich);
router.route('/update/:id').patch(enrichController.updateEnrich);
router.route('/delete/:id').delete(enrichController.deleteEnrich);

module.exports = router;
