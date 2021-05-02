/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const services = require("./reservations.service");

async function list(req, res) {
  const date = req.query.date;
  res.json({ data: await services.getReservations(date) });
}

async function create(req, res) {
  const newReservation = {
    ...req.body.data,
  };
  services
    .createReservation(newReservation)
    .then((newReservation) =>
      res.status(201).json({ data: newReservation[0] })
    );
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
