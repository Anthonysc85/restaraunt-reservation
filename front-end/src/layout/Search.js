import React, { useState } from "react";
import { Link } from "react-router-dom";
import { mobileSearch } from "../utils/api";
import ReservationCard from "../components/ReservationCard";

function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const search = await mobileSearch(mobileNumber);
    setSearchResults(search);
    setHasSearched(true);
  };

  const handleNumberInput = (e) => {
    setMobileNumber(e.target.value);
  };

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Search
          </li>
        </ol>
      </nav>
      <h2>Mobile search:</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            name="mobile_number"
            type="search"
            className="form-control rounded"
            placeholder="Enter a customer's phone number"
            aria-label="Search"
            aria-describedby="search-addon"
            onChange={handleNumberInput}
            value={mobileNumber}
          />
          <button type="submit" className="btn btn-success">
            Find
          </button>
        </div>
        {/* Cancel and Submit buttons with appropriate routing */}
      </form>
      {searchResults.length > 0 ? (
        searchResults.map((reservation) => {
          return (
            <ReservationCard
              key={reservation.reservation_id}
              reservation={reservation}
            />
          );
        })
      ) : hasSearched ? (
        <h5>No reservations found</h5>
      ) : null}
    </div>
  );
}

export default Search;
