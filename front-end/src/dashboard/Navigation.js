import React from "react";

function Navigation({ onClick }) {
  return (
    <div className="btn-group" role="group" aria-label="Basic example">
      <button
        type="button"
        className="btn btn-primary mr-3"
        value="prev"
        onClick={onClick}
      >
        Prev
      </button>
      <button
        type="button"
        className="btn btn-secondary mr-3"
        value="today"
        onClick={onClick}
      >
        Today
      </button>
      <button
        type="button"
        className="btn btn-primary mr-3"
        value="next"
        onClick={onClick}
      >
        Next
      </button>
    </div>
  );
}

export default Navigation;
