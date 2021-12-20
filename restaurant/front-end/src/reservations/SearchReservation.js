import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardReservations from "../dashboard/DashboardReservations";

export default function SearchReservation() {
  const [foundReservations, setFoundReservations] = useState([]);
  const [foundReservationErrors, setFoundReservationErrors] = useState(null);

  const [notFound, setNotFound] = useState(false);

  function changeHandler() {
    //resets state of notFound back to false when the input is being changed
    setNotFound(false);
  }

  function submitHandler(e) {
    //submits the phone number then lists the reservations found matching the phone number
    e.preventDefault();
    setFoundReservations([]);
    const mobile_number = document.getElementById("mobile_number").value;
    const abortController = new AbortController();

    listReservations({ mobile_number }, abortController.signal)
      .then((res) => {
        if (res.length) {
          setFoundReservations(res);
        } else setNotFound(true);
      })
      .catch(setFoundReservationErrors);

    return () => abortController.abort();
  }

  return (
    <>
      <div className="p-3 my-2 bg-dark text-white">
        <div className="row m-2 justify-content-center">
          <div className="col-4.5  p-3 bg-dark text-white">
            <h1 className="m-2">Search for a Reservation</h1>
          </div>
        </div>
      </div>
      <ErrorAlert error={foundReservationErrors} />

      <div className="row justify-content-center p-2">
        <div className="col-8">
          <input
            type="text"
            className="form-control form-control"
            id="mobile_number"
            name="mobile_number"
            onChange={changeHandler}
            placeholder="Enter your phone number"
          />
        </div>
        <div className="col-2">
          <button
            type="submit"
            onClick={submitHandler}
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </div>

      <div>
        <h6>
          {foundReservations.length ? (
            <DashboardReservations reservations={foundReservations} />
          ) : null}
        </h6>
        {notFound ? <p>No reservations found</p> : null}
      </div>
    </>
  );
}
