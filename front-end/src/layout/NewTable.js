import React, { useState } from "react";
import { createTable } from "../utils/api";
import { today } from '../utils/date-time';
import { Link, useHistory } from "react-router-dom";

// create New Table component
function NewTable() {
  const history = useHistory();
  // create a state for each field to be submitted
  const [tableName, setTableName] = useState("");
  const [tableCapacity, setTableCapacity] = useState("1");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tableObj = {
      table_name: tableName,
      capacity: parseInt(tableCapacity),
    };

    await createTable(tableObj);

    history.push(`/dashboard?date=${today()}`);
  };

  const handleTableName = (e) => {
    setTableName(e.target.value);
  };
  const handleTableCapacity = (e) => {
    setTableCapacity(e.target.value);
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    // breadcrumb nav links atop the page with routing to dashboard
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Create table
          </li>
        </ol>
      </nav>
      {/* 
//       <h2>Seat a table</h2>
//       {/* a form with a field for each key in reservationObj; each field is contained within an input with its own label */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="table_name" className="form-label">
            First name:
          </label>
          <input
            name="table_name"
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Enter at least two letters"
            onChange={handleTableName}
            required
          ></input>
          <label htmlFor="table_capacity" className="form-label">
            Table Capacity:
          </label>{" "}
          <input
            name="capacity"
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Party size must be at least 2"
            onChange={handleTableCapacity}
            required
          ></input>
        </div>
        {/* Cancel and Submit buttons with appropriate routing */}
        <button onClick={goBack} className="btn btn-danger">
          Cancel
        </button>
        {``} {``} {``} {``}{" "}
        <button type="submit" className="btn btn-success">
          Submit
        </button>
        {``} {``} {``} {``}
      </form>
    </div>
  );
}

export default NewTable;
