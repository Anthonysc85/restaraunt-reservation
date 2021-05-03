import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationSearch from "../reservations/ReservationSearch";
import ReservationsForm from "../reservations/ReservationsForm";
import SeatTable from "../tables/SeatTable";
import TablesForm from "../tables/TablesForm";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationsForm />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <ReservationsForm />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatTable />
      </Route>
      <Route path="/search">
        <ReservationSearch />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/tables/new">
        <TablesForm />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
