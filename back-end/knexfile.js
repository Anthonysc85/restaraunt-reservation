/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */
require("dotenv").config();
const path = require("path");

const {
  DATABASE_URL = "postgres://srtvvctx:XMy8d8snA6mEhldk3-qflX4RZHpsHcWC@ziggy.db.elephantsql.com:5432/srtvvctx",
  DATABASE_URL_DEVELOPMENT = "postgres://phbdifgu:hsNFlNHp34wpy8lWr8NzYHCGXbnP9dfM@ziggy.db.elephantsql.com:5432/phbdifgu",
  DATABASE_URL_TEST = "postgres://vgwvtvld:L8sr9JW0bLSqJBneykj-Au6W-Ep4AdAm@ziggy.db.elephantsql.com:5432/vgwvtvld",
  DATABASE_URL_PREVIEW = "postgres://gkjluzkx:3BHw0iPleS6Wl_agajzOFdwYNN6JUqeP@ziggy.db.elephantsql.com:5432/gkjluzkx",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
