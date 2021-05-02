import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationsForm from "../reservations/ReservationsForm";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";

function Reservations() {
  const history = useHistory();
  const [error, setError] = useState(null);

  function onCancel() {
    history.push(`/dashboard`);
  }
  function onSubmit(newReservation) {
    const abortController = new AbortController();
    createReservation(newReservation, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch(setError);
    return () => abortController.abort();
  }

  return (
    <div>
      <h1>New Reservation:</h1>
      <ErrorAlert error={error} />
      <ReservationsForm onCancel={onCancel} onSubmit={onSubmit} />
    </div>
  );
}

export default Reservations;
