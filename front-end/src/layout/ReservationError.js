import React from "react";

function ReservationError(props) {
  return (
    <div className="alert alert-danger" role="alert">
      {props.error}
    </div>
  );
}

export default ReservationError;
