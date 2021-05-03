import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readReservation, editReservation } from "../utils/api";
import { formatAsDate, today } from "../utils/date-time";
import { format } from "date-fns";

import ReservationError from "./ReservationError";

const EditReservation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfReservation, setDateOfReservation] = useState("");
  const [timeOfReservation, setTimeOfReservation] = useState("");
  const [people, setPeople] = useState(1);
  const [error, setError] = useState([]);

  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    const loadReservation = async () => {
      const reservation = await readReservation(reservation_id);

      if (reservation) {
        setFirstName(reservation.first_name);
        setLastName(reservation.last_name);
        setMobileNumber(reservation.mobile_number);
        setDateOfReservation(
          format(new Date(reservation.reservation_date), "yyyy-MM-dd")
        );
        setTimeOfReservation(reservation.reservation_time);
        setPeople(reservation.people);
      }
    };

    loadReservation();
  }, [reservation_id]);

  const goBack = () => {
    history.goBack();
  };

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

    const reservationObj = {
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      reservation_date: dateOfReservation,
      reservation_time: timeOfReservation,
      people: parseInt(people), // must be at least 1
    };

    const reservation = await editReservation(reservationObj, reservation_id);

    if (reservation) {
      history.push(
        `/dashboard?date=${formatAsDate(reservation.reservation_date)}`
      );
    }
  };

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

  // ok my thought process here was, copy the newReservation page over here except for the placeholder do {reservation.first_name} etc etc for each field so that those fields can be prefilled. but i think placeholder does not actually fill it, and idk if this would satisfy the test. i wanted to set the form to a state but then i messed up somewhere.
  //this page is the actual edit reservation which should house the form, and then the button functionality for Edit and Cancel (cancel needs to launch "Do you want to cancel this reservation? This cannot be undone." where ok sets the status to cancelled and the page is refreshed.)

  return (
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
            Edit Reservation
          </li>
        </ol>
      </nav>

      <h2>Edit Reservation</h2>

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
            value={firstName}
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
            value={lastName}
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
            value={mobileNumber}
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
            value={dateOfReservation}
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
            value={timeOfReservation}
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
            value={people}
            required
          ></input>
        </div>
        {/* Cancel and Submit buttons with appropriate routing */}
        {/* first cancel button syntax */}
        <button
          type="button"
          onClick={goBack}
          className="btn btn-outline-danger"
        >
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
        <button type="submit" className="btn btn-outline-success">
          Submit
        </button>
        {``} {``} {``} {``}
      </form>
    </div>
  );
};

export default EditReservation;
