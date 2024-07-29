var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');
const companyController = require('../controllers/companyController');
const jobController = require('../controllers/jobController');
const asyncHandler = require('express-async-handler');

/* GET home page. */
router.get('/', asyncHandler(indexController.homepage));

router.get('/companies', asyncHandler(companyController.getCompanies) );

router.get('/companies/:companyId', asyncHandler(companyController.viewCompany))

// Route to display the job form
router.get('/companies/:companyId/new-job', asyncHandler(companyController.addJobGet));

// Route to handle form submission
router.post('/companies/:companyId/new-job', asyncHandler(companyController.addJobPost));

router.get('/companies/:companyId/jobs/:jobId', asyncHandler(jobController.viewJob));

router.get('/companies/:companyId/jobs/:jobId/update', asyncHandler(jobController.updateJobGet));

router.post('/companies/:companyId/jobs/:jobId/update', asyncHandler(jobController.updateJobPost));

router.get('/companies/:companyId/jobs/:jobId/delete', asyncHandler(jobController.deleteJob));

router.get('/jobs', asyncHandler(jobController.getJobs));


module.exports = router;
