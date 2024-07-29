const pool = require("./pool");

async function getJobs(searchQuery) {
    /*
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
  */
  let rows
  if (searchQuery) {
    // Why does the beneath work but not immeditaly assigning to rows?
    const result = await pool.query("SELECT * FROM jobs WHERE title ILIKE $1", [`%${searchQuery}%`])
    rows = result.rows
  } else {
    const result = await pool.query("SELECT * FROM jobs");
    rows = result.rows;
  }
  
  return rows;
}

async function getAllJobs() {
    const { rows } = await pool.query("SELECT * FROM jobs");
    return rows;
}

async function getAllCompanies() {
    // Query to get all companies
    const companiesResult = await pool.query("SELECT * FROM companies");
    const companies = companiesResult.rows;

    // Query to get jobs for each company
    const jobsResult = await pool.query(`
        SELECT 
            jobs.id AS job_id,
            jobs.title AS job_title,
            jobs.location AS job_location,
            jobs.date_posted AS job_date_posted,
            jobs.description AS job_description,
            jobs.company_id AS company_id
        FROM jobs
    `);
    const jobs = jobsResult.rows;

    // Query to get awards for each company
    const awardsResult = await pool.query(`
        SELECT 
            awards.id AS award_id,
            awards.name AS award_name,
            awards.description AS award_description,
            awards.company_id AS company_id
        FROM awards
    `);
    const awards = awardsResult.rows;

    // Query to get sectors for each company
    const sectorsResult = await pool.query(`
        SELECT 
            sectors.id AS sector_id,
            sectors.name AS sector_name,
            cs.company_id AS company_id
        FROM sectors
        JOIN company_sector cs ON sectors.id = cs.sector_id
    `);
    const sectors = sectorsResult.rows;

    // Aggregate data
    const companiesWithDetails = companies.map(company => {
        return {
            ...company,
            jobs: jobs.filter(job => job.company_id === company.id),
            awards: awards.filter(award => award.company_id === company.id),
            sectors: sectors.filter(sector => sector.company_id === company.id).map(sector => sector.sector_name),
        };
    });
    return companiesWithDetails
}

async function getAllJobsWithCompanies() {
    const {rows} = await pool.query(`
         SELECT
            jobs.id AS job_id,
            jobs.title AS job_title,
            jobs.location AS job_location,
            jobs.date_posted AS job_date_posted,
            jobs.description AS job_description,
            companies.id AS company_id,
            companies.name AS company_name
        FROM
            jobs
        JOIN
            companies
        ON
            jobs.company_id = companies.id;
        
        `
    )
    return rows;
}

async function getCompanies(searchQuery) {
    /*
  const { rows } = await pool.query("SELECT * FROM developers");
  return rows;
  */
  let rows
  if (searchQuery) {
    const result = await pool.query("SELECT * FROM companies WHERE name ILIKE $1", [`%${searchQuery}%`]);
    rows = result.rows;
  } else {
    const result = await pool.query("SELECT * FROM companies");
    rows = result.rows;
  }
  return rows;
}

async function findCompany(companyId) {
    const { rows } = pool.query("SELECT * FROM companies WHERE id = $1", [companyId]);
    return rows[0];
}

async function addNewJob(companyId, response) {
    const { title, location, description } = response;
    const datePosted = new Date().toISOString().split('T')[0];

    await pool.query("INSERT INTO jobs (company_id, title, location, date_posted, description) VALUES ($1, $2, $3, $4, $5) RETURNING *", [companyId, title, location, datePosted, description])
}

async function deleteJob(companyId, jobId) {
  await pool.query("DELETE FROM jobs WHERE company_id = $1 AND id = $2", [companyId, jobId]);
}

async function deleteCompany(companyId) {
    const jobs = await pool.query("SELECT * FROM jobs WHERE company_id = companyId");
    if (jobs.length === 0) {
        await pool.query("DELETE FROM companies WHERE id = companyId");
    } else {
        // I want a confirm box to come up here to say this as I will delete all jobs from this company if confirmed
        return console.error("There are still jobs available.");
    }
}

async function updateJob(title, location, description, date_posted, companyId, jobId) {
    const result = await pool.query(`UPDATE jobs
        SET title = $1, location = $2, description = $3, date_posted = $4
        WHERE id = $5 AND company_id = $6`, [title, location, description, date_posted, jobId, companyId]);
    return result
    
}

module.exports = {
  getAllCompanies,
  getAllJobs,
  getAllJobsWithCompanies,
  getJobs,
  getCompanies,
  addNewJob,
  deleteJob,
  findCompany,
  deleteCompany,
  updateJob
};
