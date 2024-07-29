var express = require('express');
var jobRouter = express.Router();
const jobController = require('../controllers/jobController');
const asyncHandler = require('express-async-handler');

/* GET jobs page. */
jobRouter.get('/', asyncHandler(jobController.getJobs));

module.exports = jobRouter;
