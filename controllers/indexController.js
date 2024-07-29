const db = require('../db/queries')

async function homepage(req, res) {
    const jobs = await db.getAllJobsWithCompanies();
    console.log(jobs)
    res.render('index', {title:"Home", jobs});
}

module.exports = {
    homepage
}