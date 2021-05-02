const knex = require("../db/connection");

const getReservations = (date) =>
  knex("reservations").select("*").where("reservation_date", date);

const createReservation = (newReservation) =>
  knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((reservations) => reservations[0]);

module.exports = {
  getReservations,
  createReservation,
};
