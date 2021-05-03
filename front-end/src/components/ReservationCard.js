import React from "react";
import { Link } from "react-router-dom";
import { deleteReservation } from "../utils/api";

const ReservationCard = ({ reservation, loadDashboard }) => {

  const cancelPrompt = async (e) => {
    e.preventDefault();
    if (
      window.confirm(
        "Do you want to cancel this reservation? \n\n This cannot be undone."
      )
    ) {
      const returnedReservation = await deleteReservation(
        reservation.reservation_id
      );

      if (returnedReservation) loadDashboard();
    }
  };

  return (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">
          {reservation.first_name} {reservation.last_name}
        </h5>
        <p className="card-text">
          Mobile Number: {reservation.mobile_number}
          <br />
          Date: {reservation.reservation_date}
          <br />
          Time: {reservation.reservation_time}
          <br />
          People: {reservation.people}
          <br />
          <span data-reservation-id-status={reservation.reservation_id}>
            Status: {reservation.status}
          </span>
        </p>

        <div>
        {reservation.status === "booked" ? (
          <Link
            to={`/reservations/${reservation.reservation_id}/seat`}
            href={`/reservations/${reservation.reservation_id}/seat`}
            className="btn btn-success btn-lg btn-block"
          >
            Seat
          </Link>
        ) : null}
      
      
      { reservation.status === "booked" ? <Link
        to={`/reservations/${reservation.reservation_id}/edit`}
        href={`/reservations/${reservation.reservation_id}/edit`}
        className="btn btn-info btn-lg btn-block"
      >
        Edit
      </Link> : null }
      <button
        data-reservation-id-cancel={reservation.reservation_id}
        className="btn btn-danger btn-lg btn-block"
        onClick={cancelPrompt}
      >
        Cancel
      </button>
    </div>
        
      </div>
    </div>
  );
};

export default ReservationCard;
