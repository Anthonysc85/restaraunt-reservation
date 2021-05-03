const knex = require("../db/connection");

async function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time", "asc");
}

async function create(newReservation) {
  return knex("reservations").insert(newReservation).returning("*");
}

async function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

async function update(reservation_id, status) {
  return knex("reservations")
    .update({ status: status })
    .where({ reservation_id: reservation_id })
    .returning("*");
}

async function search(mobile_number) {
  return knex("reservations")
    .select("*")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

async function edit(editedReservation, reservation_id) {
  return knex("reservations")
    .update(editedReservation)
    .where({ reservation_id: reservation_id })
    .returning("*");
}

module.exports = {
  list,
  create,
  read,
  update,
  search,
  edit,
};
