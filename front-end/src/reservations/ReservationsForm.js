import React, { useState } from "react";

function ReservationsForm({
  onSubmit,
  onCancel,
  initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "HH:mm",
    people: 0,
  },
}) {
  const [reservation, setReservation] = useState(initialState);

  function changeHandler({ target: { name, value } }) {
    setReservation((prevReservation) => ({
      ...prevReservation,
      [name]: value,
    }));
  }
  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    onSubmit(reservation);
  }

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label>
          First name:
          <input
            type="text"
            name="first_name"
            maxLength="20"
            value={reservation.first_name}
            onChange={changeHandler}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Last name:
          <input
            type="text"
            name="last_name"
            maxLength="20"
            value={reservation.last_name}
            onChange={changeHandler}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Mobile number:
          <input
            type="tel"
            name="mobile_number"
            placeholder="123-456-7890"
            pattern="^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$"
            value={reservation.mobile_number}
            onChange={changeHandler}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Date of reservation:
          <input
            type="date"
            name="reservation_date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            value={reservation.reservation_date}
            onChange={changeHandler}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Time of reservation
          <input
            type="time"
            name="reservation_time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            min="05:00"
            max="23:00"
            value={reservation.reservation_time}
            onChange={changeHandler}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Party size:
          <input
            type="number"
            name="people"
            min="1"
            max="50"
            value={reservation.people}
            onChange={changeHandler}
            required
          />
        </label>
      </div>
      <div>
        <input type="submit" value="Submit" />
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ReservationsForm;
