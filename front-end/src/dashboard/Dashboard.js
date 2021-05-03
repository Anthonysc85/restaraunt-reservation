import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "../components/ReservationCard";
import TableCard from "../components/TableCard";

import { format } from 'date-fns';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) { // don't pass date, try creating state for date
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  let location = useLocation();
  let urlDate = new URLSearchParams(location.search).get("date");

  const history = useHistory();

  const query = new URLSearchParams(history.location.search).get("date");

  if (query) {
    date = query;
  }

  useEffect(() => {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(tablesError, setTablesError);
  }, [date, tablesError]);



  const loadDashboard = () => { 
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(tablesError, setTablesError);

    return () => abortController.abort();
  }

  return (
    <main>
      {/* <nav className="mt-3" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <h3>Dashboard</h3>
          </li>
          <li class-name="breadcrumb-item"></li>
          <li className="breadcrumb-item active" aria-current="page">
            <h3>{format(new Date(date), "MMMM dd, yyyy")}</h3>
          </li>
        </ol>
      </nav> */}
      

      {/* <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Schedule for {date}</h4>
      </div> */}
      <ErrorAlert error={reservationsError} />

      <div className="container">
        <div className="row" style={{justifyContent: "center"}}>
          <div className="col-3 text-center">
            <h2>Dashboard &nbsp;</h2>
          </div>
          <div className="col-3 text-center">
            <h2>{format(new Date(date), "MMMM dd, yyyy")}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <div
              className="btn-group"
              role="group"
              aria-label="Basic mixed styles example"
            >

              <Link to={`/dashboard?date=${previous(urlDate)}`} type="button" role="button" className="btn btn-outline-info">
                Previous
              </Link>

              <Link to={`/dashboard?date=${today()}`} type="button" role="button" className="btn btn-info">
                Today
              </Link>

              <Link to={`/dashboard?date=${next(urlDate)}`} type="button" role="button" className="btn btn-outline-info">
                Next
              </Link>

            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h5>Reservations</h5>
            {reservations.map((reservation) => {
              return (
                <ReservationCard
                  key={reservation.reservation_id}
                  reservation={reservation}
                  loadDashboard={loadDashboard}
                />
              );
            })}
          </div>
          <div className="col" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h5>Tables</h5>
            {tables.map((table) => {
              return <TableCard key={table.table_id} table={table} loadDashboard={loadDashboard} />;
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
