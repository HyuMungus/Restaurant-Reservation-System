import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { updateReservationStatus } from "../utils/api";

export default function DashboardReservations({ reservations, loadDashboard }) {
  const [cancelReservationErrors, setCancelReservationErrors] = useState(null);

  async function cancelHandler(reservation_id) {
    //cancels the reservation in which the user selected
    if (window.confirm("Do you want to cancel this reservation?")) {
      const abortController = new AbortController();
      setCancelReservationErrors(null);
      await updateReservationStatus(
        reservation_id,
        { data: { status: "cancelled" } },
        abortController.signal
      )
        .then(loadDashboard)
        .catch(setCancelReservationErrors);
      return () => abortController.abort();
    }
  }

  const displayReservations = reservations.map((reservation, index) => {
    return (
      <tr key={index}>
        <th scope="row">{reservation.reservation_id}</th>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.people}</td>
        <td>
          <p data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </p>
        </td>
        <td>
          {reservation.status !== "booked" ? null : (
            <>
              <a
                href={`/reservations/${reservation.reservation_id}/seat`}
                className="btn btn-primary mx-2"
              >
                Seat
              </a>
            </>
          )}
          {reservation.status !== "booked" ? null : (
            <>
              <a
                href={`/reservations/${reservation.reservation_id}/edit`}
                className="btn btn-secondary mx-2"
              >
                Edit
              </a>
            </>
          )}
          {reservation.status !== "booked" ? null : (
            <>
              <button
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={() => cancelHandler(reservation.reservation_id)}
                className="btn btn-danger ml-2"
              >
                Cancel
              </button>
            </>
          )}
        </td>
      </tr>
    );
  });

  return (
    <>
      <ErrorAlert error={cancelReservationErrors} />
      <table className="table caption-top">
        <thead>
          <tr>
            <th scope="col">Reservation ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Party Size</th>
            <th scope="col">Status</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>{displayReservations}</tbody>
      </table>
    </>
  );
}
