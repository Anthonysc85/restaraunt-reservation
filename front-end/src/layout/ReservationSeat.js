import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  listTables,
  readReservation,
  assignReservationToTable,
} from "../utils/api";

function ReservationSeat() {
  const history = useHistory();
  const params = useParams();
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");

  useEffect(() => {
    const loadTables = async () => {
      const returnedTables = await listTables();
      setTables(returnedTables);
    };
    const loadReservation = async () => {
      const returnedReservation = await readReservation(
        parseInt(params.reservation_id)
      );
      setReservation(returnedReservation);
    };
    loadTables();
    loadReservation();
  }, [params.reservation_id]);

  const tableSelect = (e) => {
    setSelectedTable(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateCapacity()) {
      alert("Too many people in reservation");
      return;
    }

    const data = {
      reservation_id: reservation.reservation_id,
      table_id: parseInt(selectedTable),
    };
    await assignReservationToTable(data);

    history.push("/");
  };

  const goBack = () => {
    history.goBack();
  };

  const validateCapacity = () => {
    const foundTable = tables.find(
      (table) => table.table_id === parseInt(selectedTable)
    );

    return reservation.people > foundTable.capacity;
  };

  return (
    <div>
      <h1>{params.reservation_id}</h1>
      <div className="input-group mt-3 mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text">Table</label>
        </div>
        <select
          className="custom-select"
          name="table_id"
          value={selectedTable}
          onChange={tableSelect}
        >
          <option value="">Select a table</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="btn btn-success"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button type="button" className="btn btn-danger" onClick={goBack}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ReservationSeat;
