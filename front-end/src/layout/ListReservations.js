import React from "react";
import { deleteReservation } from "../utils/api/index";
import { Link } from "react-router-dom";

function ListReservations(props) {
  const handleDeleteClick = async () => {
    if (
      window.confirm(
        "Delete this reservation?\n\nYou will not be able to recover it."
      )
    ) {
      await deleteReservation(props.id);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <h5 className="card-title">{props.cards.length} cards</h5>
        <p className="card-text">{props.description}</p>
        <Link to={`/decks/${props.id}`} className="btn btn-secondary">
          View
        </Link>
        <Link to={`/decks/${props.id}/study`} className="btn btn-primary">
          Study
        </Link>
        <button
          className="btn btn-danger float-right"
          title="Delete deck"
          onClick={handleDeleteClick}
        >
          <span className="oi oi-trash" />
        </button>
      </div>
    </div>
  );
}

export default ListReservations;
