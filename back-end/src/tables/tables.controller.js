const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const services = require("./tables.services");
const reservationServices = require("../reservations/reservations.service");

async function inputValidation(req, res, next) {
  const table_id = res.locals.table_id;
  if (!req.body.data)
    return next({ status: 400, message: "Form cannot be empty" });
  let { table_name, capacity } = req.body.data;

  if (!table_name || table_name.length < 2)
    return next({ status: 400, message: "table_name missing" });

  if (!capacity || capacity < 1)
    return next({ status: 400, message: "capacity missing" });

  if (typeof capacity !== "number")
    return next({
      status: 400,
      message: "capacity must be a number",
    });

  res.locals.table = {
    table_id,
    table_name,
    capacity,
  };
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  if (!table_id || table_id === "undefined") {
    return next({
      status: 404,
      message: `Choose a table with a valid table_id.`,
    });
  }
  const table = await services.read(table_id);
  if (!table) {
    return next({
      status: 404,
      message: `Table ${table_id} cannot be found.`,
    });
  }
  res.locals.table = table;
  res.locals.table_id = table_id;
  next();
}

async function tableAvailable(req, res, next) {
  const { occupied, table_name } = res.locals.table;
  if (occupied === true)
    return next({
      status: 400,
      message: `Table ${table_name} is currently occupied`,
    });
  next();
}

async function tableOccupied(req, res, next) {
  const { occupied, table_name } = res.locals.table;
  if (occupied === false)
    return next({
      status: 400,
      message: `Table ${table_name} is not occupied`,
    });
  next();
}

async function reservationExists(req, res, next) {
  if (!req.body.data || !req.body.data.reservation_id)
    return next({
      status: 400,
      message: "Form cannot be empty, must include reservation_id",
    });

  const id = req.body.data.reservation_id;
  const reservation = await reservationServices.readReservation(id);

  if (!reservation || reservation.length < 1) {
    return next({
      status: 404,
      message: `Reserveration ${id} cannot be found.`,
    });
  }

  if (reservation.status === "seated")
    return next({
      status: 400,
      message: "Reservation has already been seated.",
    });

  res.locals.reservation = reservation;
  next();
}

async function validCapacity(req, res, next) {
  const { capacity } = res.locals.table;
  const { first_name, people } = res.locals.reservation;
  if (people > capacity)
    return next({
      status: 400,
      message: `The maximum capacity for this table is ${capacity}, and cannot accomodate ${first_name}'s party of ${people}`,
    });
  next();
}

async function list(req, res) {
  res.json({ data: await services.list() });
}

async function create(req, res) {
  const newTable = res.locals.table;
  const response = await services.create(newTable);
  res.status(201).json({ data: response[0] });
}

async function update(req, res, next) {
  const { reservation_id, status } = res.locals.reservation;
  const { table_id } = res.locals.table;
  if (status === "booked")
    await reservationServices.updateStatus(reservation_id, "seated");
  const response = await services.update(table_id, reservation_id);
  res.status(200).json({ data: response });
}

async function destroy(req, res, next) {
  const { table_id, reservation_id } = res.locals.table;
  const response = await services.destroy(table_id);
  await reservationServices.updateStatus(reservation_id, "finished");
  res.status(200).json({ data: response });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(inputValidation), asyncErrorBoundary(create)],
  update: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(tableAvailable),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validCapacity),
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(tableOccupied),
    asyncErrorBoundary(destroy),
  ],
};
