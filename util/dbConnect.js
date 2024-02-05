const pg = require("pg");

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    password: "Root@123",
    database: "openInApp",
    port: 5432
});
// let connectionPool = new pgCon.Pool({
//     user: "postgres",
//     host: "localhost",
//     password:"Root@123",
//     database: "openInApp",
//     port: 5432,
//     max: 10
// });
module.exports = db;