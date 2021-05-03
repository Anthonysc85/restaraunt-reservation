import React, { useState } from "react";
import { useHistory } from "react-router";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import formatReservationTime from "../utils/format-reservation-time";
import formatReservationDate from "../utils/format-reservation-date";
import ReservationCards from "./ReservationCards";

function ReservationSearch() {
  const [reservations, setReservations] = useState([]);
  const [mobile, setMobile] = useState();
  const [error, setError] = useState(null);
  const history = useHistory();

  function onCancel() {
    history.push(`/dashboard`);
  }

  function submitNew(mobile_number) {
    const abortController = new AbortController();
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setMobile((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const { mobile_number } = mobile;
    submitNew(mobile_number);
  }

  const cards = reservations.map((reservation, key) => {
    formatReservationTime(reservation);
    formatReservationDate(reservation);
    return <ReservationCards reservation={reservation} key={key} />;
  });

  return (
    <div className="my-3">
      <ErrorAlert error={error} />
      <div className="row justify-content-center">
        <div className="col-6">
          <h1 className="pb-3">Search by mobile number</h1>
          <form onSubmit={submitHandler}>
            <div>
              <label className="w-100">
                <input
                  type="tel"
                  name="mobile_number"
                  className="mb-3 form-control"
                  placeholder="Enter a customer's phone number"
                  onChange={changeHandler}
                  required
                />
              </label>
            </div>
            <div>
              <input type="submit" value="Find" className="btn btn-success" />
              <button
                type="button"
                className="btn btn-secondary ml-3"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="row justify-content-center">
        {cards.length > 0 ? (
          cards
        ) : (
          <p className="lead pt-5">No reservations found</p>
        )}
      </div>
    </div>
  );
}

export default ReservationSearch;
