
import React from 'react';
import { today } from "../utils/date-time"
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">Periodic Tables</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <Link className="nav-link" to={`/dashboard?date=${today()}`}>
                        <span className="oi oi-dashboard" />
                        &nbsp;Dashboard
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/search">
                        <span className="oi oi-magnifying-glass" />
                        &nbsp;Search
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/reservations/new">
                        <span className="oi oi-plus" />
                        &nbsp;New Reservation
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/tables/new">
                        <span className="oi oi-layers" />
                        &nbsp;New Table
                    </Link>
                </li>
                </ul>
            </div>
            </nav>
    )
}

export default Navbar;