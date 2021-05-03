import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, updateTable } from "../utils/api";

function SeatTable() {
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState();
  const [error, setError] = useState(null);
  const history = useHistory();
  const { reservation_id } = useParams();
  useEffect(() => {
    const loadTables = async () => {
      const abortController = new AbortController();
      setError(null);
      try {
        const response = await listTables(abortController.signal);
        setTables(() => response);
      } catch (error) {
        setError(error);
      }
      return () => abortController.abort();
    };
    loadTables();
  }, []);

  const options = tables.map((table, key) => (
    <option type="text" key={key} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  function onCancel() {
    history.push(`/dashboard`);
  }

  function changeHandler({ target: { value } }) {
    setTableId(() => value);
  }

  async function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const abortController = new AbortController();
    updateTable(
      tableId,
      { reservation_id: reservation_id },
      abortController.signal
    )
      .then(() => history.push(`/dashboard`))
      .catch(setError);
    return () => abortController.abort();
  }

  return (
    <div>
      <ErrorAlert error={error} />
      <h1>Seat Table</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label>
            Table name:
            <select name="table_id" onChange={changeHandler}>
              <option type="text" value={"Select Table"}>
                Select Table
              </option>
              {tables.length > 0 ? options : "loading..."}
            </select>
          </label>
        </div>
        <div>
          <input type="submit" value="Submit" />
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SeatTable;
