import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { previous, today, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import DashboardReservations from "./DashboardReservations";
import DashboardTables from "./DashboardTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsErrors, setReservationsErrors] = useState(null);
  const [reservationsDate, setReservationsDate] = useState(date);
  const [tables, setTables] = useState([]);
  const [tablesErrors, setTablesErrors] = useState(null);
  const { search } = useLocation();
  const searchDate = queryString.parse(search).date;

  useEffect(loadTables, []);
  useEffect(loadDashboard, [search, reservationsDate, date, searchDate]);
  useEffect(resetDate, [search, date]);

  function loadTables() {
    //loads in all tables to the dashboard
    const abortController = new AbortController();
    setTablesErrors(null);
    listTables(abortController.signal).then(setTables).catch(setTablesErrors);

    return () => abortController.abort();
  }

  function loadDashboard() {
    //loads in all reservations to the dashboard
    const abortController = new AbortController();
    setReservationsErrors(null);

    if (searchDate) {
      setReservationsDate(searchDate.slice(0, 10));
      listReservations({ date: searchDate }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsErrors);
    } else {
      setReservationsDate(date);
      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsErrors);
    }
    return () => abortController.abort();
  }

  function resetDate() {
    //resets date on dashboard back to default
    if (search) return;
    const abortController = new AbortController();
    setReservationsDate(date);
    return () => abortController.abort();
  }

  return (
    <>
      <div className="p-2 my-2 bg-dark text-white">
        <div className="row justify-content-center">
          <div className="col-4.5 p-4 mb-2">
            <h1 className="m-6 pl-2">Dashboard</h1>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-2.5">
            <h4 className="m-2">{reservationsDate}</h4>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-1.5">
            <button id="today" type="today" className="btn btn-primary btn m-2">
              <Link
                className="text-light"
                to={`/dashboard?date=${previous(reservationsDate)}`}
              >
                Previous
              </Link>
            </button>
          </div>
          <div className="col-1.5">
            <button id="today" type="today" className="btn btn-primary btn m-2">
              <Link className="text-light" to={`/dashboard?date=${today()}`}>
                Today
              </Link>
            </button>
          </div>
          <div className="col-1.5">
            <button id="next" type="next" className="btn btn-primary btn m-2">
              <Link
                className="text-light"
                to={`/dashboard?date=${next(reservationsDate)}`}
              >
                Next
              </Link>
            </button>
          </div>
        </div>
      </div>
      <ErrorAlert error={tablesErrors} />
      <ErrorAlert error={reservationsErrors} />
      <div className="p-1 my-2">
        <DashboardReservations
          reservations={reservations}
          loadDashboard={loadDashboard}
        />
        <DashboardTables
          tables={tables}
          loadDashboard={loadDashboard}
          loadTables={loadTables}
        />
      </div>
    </>
  );
}

export default Dashboard;
