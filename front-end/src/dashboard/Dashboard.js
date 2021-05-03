import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCards from "../reservations/ReservationCards";
import Navigation from "./Navigation";
import { next, previous, readableDate, today } from "../utils/date-time";
import TableCards from "../tables/TableCards";
import { useLocation } from "react-router-dom";
import formatReservationTime from "../utils/format-reservation-time";
import formatReservationDate from "../utils/format-reservation-date";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const [date, setDate] = useState(query.get("date") || today());
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(loadDashboard, [date]);
  useEffect(() => {
    const loadTables = async () => {
      const abortController = new AbortController();
      setError(null);
      try {
        const response = await listTables(abortController.signal);
        setTables(() => response);
      } catch (error) {
        setError(error);
      }
      return () => abortController.abort();
    };
    loadTables();
  }, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
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
  const tableCards = tables.map((table, key) => (
    <TableCards table={table} key={key} />
  ));

  const cards = reservations.map((reservation, key) => {
    formatReservationTime(reservation);
    formatReservationDate(reservation);
    return <ReservationCards reservation={reservation} key={key} />;
  });

  return (
    <main className="my-3">
      <ErrorAlert error={error} />
      <div className="row justify-content-center">
        {tableCards.length > 0 ? (
          tableCards
        ) : (
          <p className="lead">Loading...</p>
        )}
      </div>
      <div className="row text-center mb-3">
        <div className="col">
          <h4 className="mb-3">Reservations for: {readableDate(date)}</h4>
          <Navigation onClick={changeDate} />
        </div>
      </div>
      <div className="row justify-content-center">
        {cards.length > 0 ? (
          cards
        ) : (
          <p className="lead">No reservations today...</p>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
