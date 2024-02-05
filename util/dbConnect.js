require("dotenv").config();
const pg = require("pg");

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    password: process.env.PG_PASSWORD,
    database: "openInApp",
    port: 5432
});
module.exports = db;