import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { formatAsDate, today } from "../utils/date-time";
import { Link, useHistory } from "react-router-dom";
import ReservationError from "./ReservationError";

// create NewReservation component
function NewReservation() {
  const history = useHistory();
  // create a state for each field to be submitted
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfReservation, setDateOfReservation] = useState("");
  const [timeOfReservation, setTimeOfReservation] = useState("");
  const [people, setPeople] = useState(1);
  const [error, setError] = useState([]);

  // click handler for Submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dateOfReservation < today()) {
      setError([...error, "Past dates not valid!"]);
      return;
    }

    let replacedTime = timeOfReservation.replace(":", "");
    if (replacedTime < 1030 || replacedTime > 2130) {
      setError([...error, "Outside operating hours!"]);
      return;
    }

    let newDate = new Date(dateOfReservation);
    let dayOfWeek = newDate.getDay();
    if (dayOfWeek === 1) {
      setError([...error, "Restaurant is closed on Tuesdays!"]);
      return;
    }
    // a single new reservation should be pushed to /dashboard upon Submit
    const reservationObj = {
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      reservation_date: dateOfReservation,
      reservation_time: timeOfReservation,
      people: parseInt(people), // must be at least 1
    };

    const newReservation = await createReservation(reservationObj);
    const { reservation_date } = newReservation;

    history.push(`/dashboard?date=${formatAsDate(reservation_date)}`);
  };

  // this block addresses Submit click functionality for each altered individual input

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
  };
  const handleMobileNumber = (e) => {
    setMobileNumber(e.target.value);
  };
  const handleDateOfReservation = (e) => {
    setDateOfReservation(e.target.value);
  };
  const handleTimeOfReservation = (e) => {
    setTimeOfReservation(e.target.value);
  };
  const handlePeople = (e) => {
    setPeople(e.target.value);
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    // breadcrumb nav links atop the page with routing to dashboard
    <div>
      {error.length
        ? error.map((err) => {
            return <ReservationError key={err} error={err} />;
          })
        : ""}

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Create Reservation
          </li>
        </ol>
      </nav>

      <h2>Create Reservation</h2>
      {/* a form with a field for each key in reservationObj; each field is contained within an input with its own label */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First name:
          </label>
          <input
            name="first_name"
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Mandatory first name (cannot contain numbers or special characters)"
            onChange={handleFirstName}
            required
          ></input>
          <label htmlFor="last_name" className="form-label">
            Last name:
          </label>
          <input
            name="last_name"
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Mandatory last name (cannot contain numbers or special characters)"
            onChange={handleLastName}
            required
          ></input>
          <label htmlFor="mobile_number" className="form-label">
            Mobile number:
          </label>
          <input
            name="mobile_number"
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            type="tel"
            placeholder="###-###-####"
            // pattern="/\d{3}-\d{3}-\d{4}/"
            onChange={handleMobileNumber}
            required
          ></input>
          <label htmlFor="reservation_date" className="form-label">
            Date:
          </label>
          <input
            name="reservation_date"
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            type="date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={handleDateOfReservation}
            required
          ></input>
          <label htmlFor="reservation_time" className="form-label">
            Time:
          </label>
          <input
            name="reservation_time"
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            type="time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            onChange={handleTimeOfReservation}
            required
          ></input>
          <label htmlFor="people" className="form-label">
            People:
          </label>
          <input
            name="people"
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Enter party size (min 1)"
            onChange={handlePeople}
            required
          ></input>
        </div>
        {/* Cancel and Submit buttons with appropriate routing */}
        {/* first cancel button syntax */}
        <button type="button" onClick={goBack} className="btn btn-danger">
          Cancel
        </button>
        {/* below is experimental dialog prompt to confirm cancel */}
        {/* <!-- Button trigger modal --> */}
        {/* <button
          type="button"
          className="btn btn-outline-danger"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          Cancel • Pop-up Test Button • Confirmation required
        </button> */}
        {/* <!-- Modal --> */}
        {/* <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Cancel Reservation
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Cancel reservation and return to Dashboard? This cannot be
                undone.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <a
                  role="button"
                  href="/"
                  type="button"
                  className="btn btn-outline-success"
                >
                  Cancel reservation
                </a>
              </div>
            </div>
          </div>
        </div> */}
        {``} {``} {``} {``}
        <button type="submit" className="btn btn-success">
          Submit
        </button>
        {``} {``} {``} {``}
      </form>
    </div>
  );
}

export default NewReservation;
