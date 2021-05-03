/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const services = require("./reservations.service");

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await services.readReservation(reservation_id);
  if (!reservation || !reservation_id) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.`,
    });
  }
  res.locals.reservation = reservation;
  res.locals.reservation_id = reservation_id;
  next();
}

async function formatDate(req, res, next) {
  let { reservation_date } = res.locals.reservation;
  reservation_date = reservation_date.toISOString().slice(0, 10);
  res.locals.reservation = {
    ...res.locals.reservation,
    reservation_date: reservation_date,
  };
  next();
}

async function statusValidation(req, res, next) {
  const currStatus = res.locals.reservation.status;
  const { status } = req.body.data;

  if (currStatus === "finished")
    return next({
      status: 400,
      message: "A finished reservation cannot be updated.",
    });
  if (currStatus === "cancelled")
    return next({
      status: 400,
      message: "A cancelled reservation cannot be updated.",
    });
  if (
    status !== "booked" &&
    status !== "seated" &&
    status !== "finished" &&
    status !== "cancelled"
  )
    return next({ status: 400, message: "Status unknown" });

  next();
}

async function inputValidation(req, res, next) {
  if (!req.body.data)
    return next({ status: 400, message: "Form cannot be empty" });
  const reservation_id = res.locals.reservation_id;
  let {
    first_name,
    last_name,
    people,
    reservation_date,
    reservation_time,
    mobile_number,
  } = req.body.data;

  if (!first_name) return next({ status: 400, message: "first_name missing" });

  if (!last_name) return next({ status: 400, message: "last_name missing" });

  if (!people) return next({ status: 400, message: "people missing" });

  if (!mobile_number)
    return next({ status: 400, message: "mobile_number missing" });

  if (!reservation_date)
    return next({
      status: 400,
      message: "reservation_date missing",
    });

  if (!reservation_time)
    return next({
      status: 400,
      message: "reservation_time missing",
    });

  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/))
    return next({
      status: 400,
      message: "reservation_date must match 2021-01-21 format",
    });

  if (!reservation_time.match(/\d{2}:\d{2}/))
    return next({
      status: 400,
      message: "reservation_time must match HH:mm format",
    });

  if (typeof people !== "number")
    return next({
      status: 400,
      message: "people must be a number",
    });

  if (req.body.data.status) {
    if (
      req.body.data.status === "seated" ||
      req.body.data.status === "finished"
    )
      return next({
        status: 400,
        message: "Cannot update a seated or finished table",
      });
  }

  res.locals.reservation = {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
  };
  next();
}

const dateValidation = (req, res, next) => {
  const { reservation_date, reservation_time } = req.body.data;
  const date = new Date(`${reservation_date} ${reservation_time}`);
  const today = new Date();

  if (date.valueOf() <= today.valueOf())
    return next({
      status: 400,
      message: `You can only reserve for future dates`,
    });

  if (date.getDay() === 2)
    return next({
      status: 400,
      message: `Tuesday is not available. The restaurant is closed.`,
    });
  next();
};

const timeValidation = (req, res, next) => {
  const { reservation_date, reservation_time } = req.body.data;
  const date = new Date(`${reservation_date} ${reservation_time}`);
  const hours = date.getHours();
  const mins = date.getMinutes();

  if (hours < 10)
    return next({
      status: 400,
      message: `Reservations are only valid from 10:30 AM to 9:30 PM.`,
    });
  if (hours === 10 && mins < 30)
    return next({
      status: 400,
      message: `Reservations are only valid from 10:30 AM to 9:30 PM.`,
    });
  if (hours >= 21 && mins >= 30)
    return next({
      status: 400,
      message: `Reservations are only valid from 10:30 AM to 9:30 PM.`,
    });
  next();
};

async function list(req, res) {
  try {
    let response;
    if (req.query.mobile_number) {
      const mobile = req.query.mobile_number;
      response = await services.searchReservation(mobile);
    }
    if (req.query.date) {
      const date = req.query.date;
      response = await services.todaysReservations(date);
    }
    if (!response) response = [];
    return res.json({ data: response });
  } catch (error) {
    console.log(error);
  }
}

async function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function create(req, res) {
  const newReservation = res.locals.reservation;
  services
    .createReservation(newReservation)
    .then((newReservation) => res.status(201).json({ data: newReservation }));
}

async function update(req, res) {
  await services.updateReservation(res.locals.reservation);
  res.json({ data: res.locals.reservation });
}

async function status(req, res) {
  const { status } = req.body.data;
  const { reservation_id } = res.locals.reservation;
  const response = await services.updateStatus(reservation_id, status);
  const newStatus = response[0].status;
  res.status(200).json({ data: { status: newStatus } });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(formatDate),
    asyncErrorBoundary(read),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(inputValidation),
    asyncErrorBoundary(dateValidation),
    asyncErrorBoundary(timeValidation),
    asyncErrorBoundary(update),
  ],
  create: [
    asyncErrorBoundary(inputValidation),
    asyncErrorBoundary(dateValidation),
    asyncErrorBoundary(timeValidation),
    asyncErrorBoundary(create),
  ],
  status: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(statusValidation),
    asyncErrorBoundary(status),
  ],
};
