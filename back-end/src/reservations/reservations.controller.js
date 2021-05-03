const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");
const express = require("express");
const app = express();

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  const { date, mobile_number } = req.query;

  if (mobile_number) {
    reservationsService
      .search(mobile_number)
      .then((data) => res.status(200).json({ data: data }));
  } else {
    reservationsService.list(date).then((data) => {
      const filteredData = data.filter(
        (r) => r.status !== "finished" && r.status !== "cancelled"
      );
      res.json({ data: filteredData });
    });
  }
}

async function create(req, res) {
  reservationsService
    .create(req.body.data)
    .then((data) => res.status(201).json({ data: data[0] }));
}

async function read(req, res) {
  const { reservation_id } = req.params;
  reservationsService
    .read(reservation_id)
    .then((data) => res.status(200).json({ data: data }));
}

async function updateReservationStatus(req, res) {
  const { reservation } = res.locals;
  reservationsService
    .update(parseInt(reservation.reservation_id), req.body.data.status)
    .then((data) => res.status(200).json({ data: data[0] }));
}

async function validateReservationStatus(req, res, next) {
  const foundReservation = await reservationsService.read(
    parseInt(req.params.reservation_id)
  );
  if (!foundReservation) {
    return next({
      status: 404,
      message: `This ${req.params.reservation_id} doesn't exist!`,
    });
  }
  if (foundReservation.status === "finished") {
    return next({
      status: 400,
      message: "Reservation is already finished!",
    });
  }
  if (
    req.body.data.status === "booked" ||
    req.body.data.status === "seated" ||
    req.body.data.status === "cancelled" ||
    req.body.data.status === "finished"
  ) {
    res.locals.reservation = foundReservation;
    return next();
  } else {
    return next({
      status: 400,
      message: "This reservation_status is unknown!",
    });
  }
}

async function validateReservation(req, res, next) {
  // validate data
  if (!req.body.data) {
    return next({
      status: 400,
      message: "Must include data!",
    });
  }

  // validate first name
  if (!req.body.data.first_name || req.body.data.first_name.length === 0) {
    return next({
      status: 400,
      message: "Must include valid first_name!",
    });
  }

  // validate last name
  if (!req.body.data.last_name || req.body.data.last_name.length === 0) {
    return next({
      status: 400,
      message: "Must include valid last_name!",
    });
  }

  // validate mobile number
  if (
    !req.body.data.mobile_number ||
    req.body.data.mobile_number.length === 0
  ) {
    return next({
      status: 400,
      message: "Must include valid mobile_number!",
    });
  }

  // validate reservation date
  if (
    !req.body.data.reservation_date ||
    !req.body.data.reservation_date.match(/\d{4}\-\d{2}\-\d{2}/g)
  ) {
    return next({
      status: 400,
      message: "Must include valid reservation_date!",
    });
  }

  if (new Date(req.body.data.reservation_date) < new Date()) {
    return next({
      status: 400,
      message: "Date must be in the future"
    });
  }

  // validate reservation time
  if (
    !req.body.data.reservation_time ||
    !req.body.data.reservation_time.match(/[0-9]{2}:[0-9]{2}/g)
  ) {
    return next({
      status: 400,
      message: "Must include valid reservation_time!",
    });
  }

  // validate people
  if (
    !req.body.data.people ||
    typeof req.body.data.people !== "number" ||
    req.body.data.people === 0
  ) {
    return next({
      status: 400,
      message: "Must include valid people!",
    });
  }

  // validate that reservation date is in the future
  const date = new Date(req.body.data.reservation_date);
  if (new Date(req.body.data.reservation_date).valueOf() < date.valueOf()) {
    return next({
      status: 400,
      message:
        "The reservation_date is in the past. Only future reservations are allowed!",
    });
  }

  // validate that reservation date does not land on a Tuesday
  if (date.getDay() === 1) {
    return next({
      status: 400,
      message: "Invalid reservation_date: restaurant closed on Tuesdays!",
    });
  }

  // validate if reservation time is within operating hours
  const replacedTime = req.body.data.reservation_time.replace(":", "");
  if (replacedTime < 1030 || replacedTime > 2130) {
    return next({
      status: 400,
      message: "The reservation_time is after store operating hours!",
    });
  }

  if (
    // !req.body.data.reservation_status ||
    !req.body.data.reservation_time.match(/[0-9]{2}:[0-9]{2}/g)
  ) {
    return next({
      status: 400,
      message: "Must include valid reservation_time!",
    });
  }

  if (req.body.data.status === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated!",
    });
  }
  if (req.body.data.status === "finished") {
    return next({
      status: 400,
      message: "Reservation is already finished!",
    });
  }
  return next();
}

async function edit(req, res, next) {
  const { reservation_id } = res.locals;
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;

  const reservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };

  reservationsService
    .edit(reservation, parseInt(reservation_id))
    .then((data) => res.status(200).json({ data: data[0] }));
}

async function reservationExists(req, res, next) {
  const foundReservation = await reservationsService.read(
    parseInt(req.params.reservation_id)
  );
  if (!foundReservation) {
    return next({
      status: 404,
      message: `This ${req.params.reservation_id} doesn't exist!`,
    });
  }

  res.locals.reservation_id = req.params.reservation_id;
  return next();
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(validateReservation), asyncErrorBoundary(create)],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
  edit: [
    asyncErrorBoundary(validateReservation),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(edit),
  ],
  update: [
    asyncErrorBoundary(validateReservationStatus),
    asyncErrorBoundary(updateReservationStatus),
  ],
};
