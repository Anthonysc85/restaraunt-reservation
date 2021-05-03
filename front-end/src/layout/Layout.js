import React from "react";
import Routes from "./Routes";
import Navbar from "../components/Navbar";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row h-100">
        <div className="col">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
