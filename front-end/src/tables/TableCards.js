import React from "react";
import { useHistory } from "react-router";
import { finishTable } from "../utils/api";

function TableCards({ table }) {
  const history = useHistory();

  async function onFinish() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      finishTable(table.table_id).then(() => history.go(0));
    }
  }
  return (
    <div
      key={table.table_id}
      className="card m-3 bg-light"
      style={{ width: "14rem" }}
    >
      <div className="card-body">
        <h5 className="card-title">{table.table_name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Capacity {table.capacity}
        </h6>
        {table.occupied ? (
          <h6 data-table-id-status={table.table_id}>occupied</h6>
        ) : (
          <h6 data-table-id-status={table.table_id}>free</h6>
        )}
        {table.occupied ? (
          <button data-table-id-finish={table.table_id} onClick={onFinish}>
            Finish
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default TableCards;
