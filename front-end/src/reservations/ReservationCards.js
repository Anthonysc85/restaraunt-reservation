import React from "react";
import formatReservationTime from "../utils/format-reservation-time";
import formatReservationDate from "../utils/format-reservation-date";

function ReservationCards({ reservations }) {
  const cards = reservations.map((reservation, key) => {
    formatReservationTime(reservation);
    formatReservationDate(reservation);
    return (
      <div className="card col-4-md m-3 text-center" key={key + 1}>
        <div className="card-body text-left">
          <h5 className="card-title">
            {reservation.first_name} {reservation.last_name}
          </h5>
          <p className="card-text">Party size: {reservation.people}</p>
          <p className="card-text">Date: {reservation.reservation_date}</p>
          <p className="card-text">Time: {reservation.reservation_time}</p>
          <p className="card-text">Phone: {reservation.mobile_number}</p>
        </div>
      </div>
    );
  });

  return cards.length > 0 ? (
    cards
  ) : (
    <p className="lead">No reservations today...</p>
  );
}

export default ReservationCards;
