const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const express = require("express");
const app = express();

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  tablesService.list().then((data) => {
    res.json({ data: data });
  });
}

async function update(req, res) {
  const { table } = res.locals;
  const { reservation_id } = req.body.data;
  const updatedTable = {
    ...table,
    occupied: true,
    reservation_id,
  };

  reservationsService
    .update(parseInt(reservation_id), "seated");

  tablesService
    .update(updatedTable)
    .then((data) => res.status(200).json({ data: data[0] }));
}

async function create(req, res) {
  const { data } = req.body;

  tablesService
    .create(data)
    .then((data) => res.status(201).json({ data: data[0] }));
}

async function validateData(req, res, next) {
  const { data } = req.body;

  if (!data) {
    next({
      status: 400,
      message: "data is missing",
    });
  }

  res.locals.data = data;
  return next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = res.locals.data;

  if (!reservation_id) {
    next({
      status: 400,
      message: "reservation_id is missing",
    });
  }

  const reservation = await reservationsService.read(reservation_id);

  if (!reservation) {
    next({
      status: 404,
      message: `Reservation with ID ${reservation_id} does not exist.`,
    });
  }

  if (reservation.status === "seated") {
    next({
      status: 400,
      message: `Reservation is already seated.`
    });
  }

  res.locals.reservation = reservation;
  return next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);
  if (!table) {
    next({
      status: 404,
      message: `Table with ID ${table_id} does not exist.`,
    });
  }

  res.locals.table = table;
  return next();
}

async function validateCreateTable(req, res, next) {
  const { data } = res.locals;

  if (!data.table_name) {
    next({
      status: 400,
      message: "table_name is missing or empty",
    });
  }

  if (data.table_name.length < 2) {
    next({
      status: 400,
      message: "table_name is too short",
    });
  }

  if (!data.capacity) {
    next({
      status: 400,
      message: "capacity is missing or zero",
    });
  }

  if (typeof data.capacity !== "number") {
    next({
      status: 400,
      message: "Capacity is not a number",
    });
  }

  return next();
}

async function validateUpdateTable(req, res, next) {
  const { table, reservation } = res.locals;

  if (table.occupied) {
    next({
      status: 400,
      message: "Table is already occupied",
    });
  }

  if (reservation.people > table.capacity) {
    next({
      status: 400,
      message: "Table does not have enough capacity",
    });
  }

  return next();
}

async function reassignTable(req, res, next) {
  const { table_id } = req.params;
  const { table } = res.locals;

  if (!table.reservation_id) {
    next({
      status: 400,
      message: `${table_id} is not occupied.`,
    });
  }

  reservationsService
    .update(table.reservation_id, "finished");

  const data = await tablesService.resetTable(table_id);
  res.status(200).json({ data: data[0] });
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(validateCreateTable),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(validateUpdateTable),
    asyncErrorBoundary(update),
  ],
  reassignTable: [asyncErrorBoundary(tableExists), 
    asyncErrorBoundary(reassignTable)],
};
