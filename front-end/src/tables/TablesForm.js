import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TablesForm() {
  const [table, setTable] = useState({
    table_name: "",
    capacity: 1,
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  function onCancel() {
    history.push(`/dashboard`);
  }

  function submitNew(newTable) {
    const abortController = new AbortController();
    createTable(newTable, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setTable((prevTable) => {
      if (name === "capacity")
        return {
          ...prevTable,
          [name]: Number(value),
        };
      return {
        ...prevTable,
        [name]: value,
      };
    });
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    submitNew(table);
  }

  return (
    <div className="my-3">
      <ErrorAlert error={error} />
      <div className="row justify-content-center">
        <div className="col-6">
          <h1 className="pb-3">New Table</h1>
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label>
                Table name:
                <input
                  type="text"
                  name="table_name"
                  className="form-control"
                  value={table.table_name}
                  onChange={changeHandler}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Capacity:
                <input
                  type="number"
                  name="capacity"
                  className="form-control"
                  min="1"
                  value={table.capacity}
                  onChange={changeHandler}
                  required
                />
              </label>
            </div>

            <div className="pt-3">
              <input
                type="submit"
                className="btn btn-primary mr-1"
                value="Submit"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TablesForm;
