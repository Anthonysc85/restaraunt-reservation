const knex = require("../db/connection");

const list = () => knex("tables").select("*").orderBy("table_name");

const create = (newTable) =>
  knex("tables").insert(newTable).returning(["capacity", "table_name"]);

const read = (id) => knex("tables").select("*").where("table_id", id).first();

const update = (table_id, id) =>
  knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .update({ reservation_id: id, occupied: true })
    .returning("*");

const destroy = (id) =>
  knex("tables")
    .where("table_id", id)
    .update({ reservation_id: null, occupied: false })
    .returning("*");

module.exports = {
  list,
  create,
  read,
  update,
  destroy,
};
