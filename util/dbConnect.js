const pg = require("pg");
require("dotenv").config();
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    password: process.env.PG_PASSWORD,
    database: "openInApp",
    port: 5432
});
module.exports = db;