const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name", "asc");
}

function update(updatedTable) {
  return knex("tables")
    .update(updatedTable)
    .where({ table_id: updatedTable.table_id })
    .returning("*");
}

function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

function create(newTable) {
  return knex("tables").insert(newTable).returning("*");
}

function resetTable(tableId) {
  return knex("tables")
    .where({ table_id: tableId })
    .update({ reservation_id: null, occupied: false })
    .returning("*");
}

module.exports = {
  list,
  update,
  read,
  create,
  resetTable,
};
