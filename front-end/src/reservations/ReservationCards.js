import React from "react";
import { readableDate } from "../utils/date-time";
import { reservationStatus } from "../utils/api";
import { Link, useHistory } from "react-router-dom";

function ReservationCards({ reservation }) {
  const history = useHistory();
  async function onCancel(event) {
    const id = Number(event.target.value);
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      reservationStatus(id, { status: "cancelled" }).then(() => history.go(0));
    }
  }
  return (
    <div
      className="card col-4-md m-3 text-center"
      id={reservation.reservation_id}
    >
      <div className="card-body text-left">
        <h5 className="card-title">
          {reservation.first_name} {reservation.last_name}
        </h5>
        <p className="card-text">Party size: {reservation.people}</p>
        <p className="card-text">Time: {reservation.reservation_time}</p>
        <p className="card-text">Phone: {reservation.mobile_number}</p>
        <p className="card-text">
          Date: {readableDate(reservation.reservation_date)}
        </p>
        <p className="card-text">Status: {reservation.status}</p>
        <div className="row">
          <Link
            to={`/reservations/${reservation.reservation_id}/seat`}
            className="btn btn-success btn-sm ml-2"
            style={
              reservation.status === "seated"
                ? { display: "none" }
                : { display: "block" }
            }
          >
            Seat
          </Link>
          <Link
            to={`/reservations/${reservation.reservation_id}/edit`}
            className="btn btn-secondary btn-sm ml-2"
          >
            Edit
          </Link>
          <button
            data-reservation-id-cancel={reservation.reservation_id}
            type="button"
            className="btn btn-danger btn-sm ml-2"
            value={reservation.reservation_id}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationCards;
