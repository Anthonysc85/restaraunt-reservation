const knex = require("../db/connection");

const todaysReservations = (date) =>
  knex("reservations")
    .select("*")
    .where("reservation_date", date)
    .whereNot("status", "finished")
    .whereNot("status", "cancelled")
    .orderBy("reservation_time");

const createReservation = (newReservation) =>
  knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((reservations) => reservations[0]);

const readReservation = (id) =>
  knex("reservations").select("*").where("reservation_id", id).first();

const updateReservation = (updatedReservation) =>
  knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .returning([
      "first_name",
      "last_name",
      "mobile_number",
      "people",
      "reservation_date",
      "reservation_time",
    ]);

const updateStatus = (id, status) =>
  knex("reservations")
    .select("*")
    .where({ reservation_id: id })
    .update({ status: status })
    .returning("*");

const searchReservation = (mobile_number) =>
  knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");

module.exports = {
  todaysReservations,
  createReservation,
  readReservation,
  updateReservation,
  updateStatus,
  searchReservation,
};
