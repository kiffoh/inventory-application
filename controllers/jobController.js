const db = require('../db/queries');
const { search } = require('../routes');

async function getJobs(req, res) {
    // Need to revise this
    const searchQuery = req.query.jobId || null;
    const jobs = await db.getAllJobsWithCompanies(searchQuery);
    console.log(jobs)
    res.render('jobs', {jobs})
}

async function viewJob(req, res) {
    const { companyId, jobId } = req.params;
    const companies = await db.getAllJobsWithCompanies();
    const jobInfo = companies.filter(company => company.company_id == companyId && company.job_id == jobId)
    res.render('jobView', {jobInfo})
}

async function updateJobGet(req, res) {
    const { companyId, jobId } = req.params;
    const companies = await db.getAllJobsWithCompanies();
    const jobInfo = companies.filter(company => company.company_id == companyId && company.job_id == jobId)[0]
    console.log(jobInfo)
    res.render('updateJobForm', {companyId, jobId, jobInfo});
}

async function updateJobPost(req, res) {
    const { companyId, jobId } = req.params;
    console.log(`Updating job ${jobId} for company ${companyId}`);
    const { title, location, description, job_date_posted } = req.body;
    await db.updateJob(title, location, description, job_date_posted, companyId, jobId);
    res.redirect(`/companies/${companyId}/jobs/${jobId}`)
}

// GOING TO REHAUL THIS WITH JOB WEBSITE STUFF AS THIS WILL ACTUALLY BE USEFUL TO ME
/*
Relations:
Companies - Jobs (One-to-Many)
Jobs - Locations (Many-to-Many)

Jobs will also have types (Many-to-Many)
Jobs will have descriptions (One-to-One)
Jobs will have a posted date
Jobs will have a potential expiry date

Companies will have sectors (Many-to-Many)
Companies will have awards / reasons they are on the website (Many-to-Many)
- Glassdoor
- Best companies
- 3* companies
- Best places to work
*/

async function deleteJob(req, res) {
    const { companyId, jobId } = req.params;
    await db.deleteJob(companyId, jobId);
    res.redirect(`/companies/${companyId}`);
}

module.exports = {
    getJobs,
    viewJob,
    updateJobGet,
    updateJobPost,
    deleteJob
}