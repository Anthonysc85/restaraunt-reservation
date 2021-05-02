import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCards from "../reservations/ReservationCards";
import Navigation from "./Navigation";
import { next, previous, readableDate, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(today());
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function changeDate(event) {
    switch (event.target.value) {
      case "prev":
        setDate(() => previous(date));
        break;
      case "next":
        setDate(() => next(date));
        break;
      default:
        setDate(() => today(date));
        break;
    }
  }

  return (
    <main className="my-3">
      <ErrorAlert error={reservationsError} />
      <div className="row text-center mb-3">
        <div className="col">
          <h4 className="mb-3">Reservations for: {readableDate(date)}</h4>
          <Navigation onClick={changeDate} />
        </div>
      </div>
      <div className="row justify-content-center">
        <ReservationCards reservations={reservations} />
      </div>
    </main>
  );
}

export default Dashboard;
