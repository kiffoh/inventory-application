#! /usr/bin/env node
require('dotenv').config();
const { Client } = require("pg");

const companies = [
  {
    name: "TechCorp",
    sectors: ["Software", "AI", "Cloud Computing"],
    awards: ["Best Tech Company 2023", "Innovative AI Award"],
    jobs: [
      {
        title: "Software Engineer",
        location: "San Francisco, CA",
        description: "Develop and maintain web applications.",
        date_posted: "2023-07-01"
      },
      {
        title: "Data Scientist",
        location: "San Francisco, CA",
        description: "Analyze data to derive business insights.",
        date_posted: "2023-07-05"
      },
      {
        title: "Cloud Architect",
        location: "Remote",
        description: "Design and implement cloud solutions.",
        date_posted: "2023-07-10"
      }
    ]
  },
  {
    name: "HealthSolutions",
    sectors: ["Healthcare", "Biotechnology"],
    awards: ["Top Healthcare Startup 2023"],
    jobs: [
      {
        title: "Biomedical Engineer",
        location: "New York, NY",
        description: "Design medical devices and equipment.",
        date_posted: "2023-07-10"
      },
      {
        title: "Clinical Researcher",
        location: "New York, NY",
        description: "Conduct clinical trials and research.",
        date_posted: "2023-07-12"
      }
    ]
  },
  {
    name: "EcoEnergy",
    sectors: ["Renewable Energy", "Sustainability"],
    awards: ["Green Energy Award 2023"],
    jobs: [
      {
        title: "Environmental Engineer",
        location: "Austin, TX",
        description: "Work on projects related to renewable energy.",
        date_posted: "2023-07-15"
      },
      {
        title: "Sustainability Consultant",
        location: "Remote",
        description: "Advise on sustainable practices.",
        date_posted: "2023-07-20"
      }
    ]
  }
];

async function main() {
  console.log("populating database...");
  const client = new Client({
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  });

  try {
    await client.connect();

    // Insert companies and related data
    for (const company of companies) {
      const companyResult = await client.query(
        "INSERT INTO companies (name) VALUES ($1) RETURNING id",
        [company.name]
      );
      const companyId = companyResult.rows[0].id;

      // Insert sectors and create relationships
      for (const sector of company.sectors) {
        let sectorResult = await client.query(
          "SELECT id FROM sectors WHERE name = $1",
          [sector]
        );
        let sectorId;
        if (sectorResult.rows.length === 0) {
          sectorResult = await client.query(
            "INSERT INTO sectors (name) VALUES ($1) RETURNING id",
            [sector]
          );
          sectorId = sectorResult.rows[0].id;
        } else {
          sectorId = sectorResult.rows[0].id;
        }
        await client.query(
          "INSERT INTO company_sector (company_id, sector_id) VALUES ($1, $2)",
          [companyId, sectorId]
        );
      }

      // Insert awards
      for (const award of company.awards) {
        await client.query(
          "INSERT INTO awards (company_id, name) VALUES ($1, $2)",
          [companyId, award]
        );
      }

      // Insert jobs
      for (const job of company.jobs) {
        await client.query(
          "INSERT INTO jobs (company_id, title, location, description, date_posted) VALUES ($1, $2, $3, $4, $5)",
          [companyId, job.title, job.location, job.description, job.date_posted]
        );
      }
    }
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await client.end();
    console.log("done");
  }
}

main();
