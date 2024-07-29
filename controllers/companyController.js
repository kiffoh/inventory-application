const db = require('../db/queries');

async function getCompanies(req, res) {
    // Need a new query to obtain all the awards and sectors and jobs for each company
    const companies = await db.getAllCompanies();
    console.log(companies)
    res.render('companies', {companies})
}

async function viewCompany(req, res) {
    const { companyId } = req.params;
    const companies = await db.getAllCompanies();
    const company = companies.filter(company => company.id == companyId);
    console.log(company)
    res.render('companyProfile', {company})
}

async function addJobGet(req, res) {
    const { companyId } = req.params;
    res.render('jobForm', { companyId });
}

async function addJobPost(req, res) {
    const { companyId } = req.params;
    const { title, location, description } = req.body;
    await db.addNewJob(companyId, { title, location, description });
    //res.send('Job added');
    res.redirect(`/companies/${companyId}`);
}

async function deleteCompany(req, res) {
    const { companyId } = req.params;
    const company = await db.findCompany(companyId);
    if (company.length == 0) {
        res.send('Company not found.')
    } else {
        await db.deleteCompany(companyId);
    }
}

module.exports = {
    getCompanies,
    viewCompany,
    addJobGet,
    addJobPost,
    deleteCompany,
}