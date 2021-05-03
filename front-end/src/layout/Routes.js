import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../layout/NewReservation";
import NewTable from "../layout/NewTable";
import ReservationSeat from "./ReservationSeat";
import Search from "../layout/Search";
import EditReservation from "../layout/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <div>
      <Switch>
        <Route exact={true} path="/">
          <Redirect to={`/dashboard?date=${today()}`} />
        </Route>

        <Route exact={true} path="/reservations">
          <Redirect to={"/dashboard"} />
        </Route>

        <Route path="/dashboard*">
          <Dashboard date={today()} />
        </Route>

        <Route path="/dashboard">
          <Dashboard date={today()} />
        </Route>

        <Route exact={true} path="/reservations/new">
          <NewReservation />
        </Route>

        <Route exact={true} path="/reservations/:reservation_id/seat">
          <ReservationSeat />
        </Route>

        <Route exact={true} path="/tables/new">
          <NewTable />
        </Route>

        <Route exact={true} path="/search">
          <Search />
        </Route>

        <Route exact={true} path="/reservations/:reservation_id/edit">
          <EditReservation />
        </Route>

        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default Routes;
