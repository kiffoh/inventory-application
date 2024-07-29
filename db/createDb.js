#! /usr/bin/env node
require('dotenv').config();

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS awards (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  date_posted VARCHAR(255),
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS sectors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS company_sector (
  company_id INTEGER REFERENCES companies(id),
  sector_id INTEGER REFERENCES sectors(id),
  PRIMARY KEY (company_id, sector_id)
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
