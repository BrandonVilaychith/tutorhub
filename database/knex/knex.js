const environment = process.env.NODE_ENV || "development";
// Set to testing if testing on a test database
const config = require("../../knexfile.js")[environment];
// const config = require("../../knexfile.js")["testing"];
module.exports = require("knex")(config);
