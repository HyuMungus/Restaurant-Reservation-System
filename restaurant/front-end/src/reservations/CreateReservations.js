import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

export default function CreateReservation() {
  const history = useHistory();
  const [currentReservation, setCurrentReservation] = useState({});
  const [reservationErrors, setReservationErrors] = useState(null);
  const [errors, setErrors] = useState({ messages: [] });

  function validateReservation(reservation, errors) {
    //function makes sure that the reservation form submitted meets all requirements
    errors.messages = [];
    const {
      first_name,
      last_name,
      mobile_number,
      reservation_time,
      reservation_date,
      people,
    } = reservation;

    const current = new Date();
    const resDate = `${reservation_date} ${reservation_time}`;
    const valid = new Date(resDate.toString());
    const validUTC = new Date(valid.toUTCString());

    if (!first_name) {
      errors.messages.push("Missing first name");
    }
    if (!last_name) {
      errors.messages.push("Missing last name");
    }
    if (!mobile_number) {
      errors.messages.push("Missing mobile number");
    }
    if (!reservation_time) {
      errors.messages.push("Missing time");
    }
    if (!reservation_date) {
      errors.messages.push("Missing date");
    }
    if (!people) {
      errors.messages.push("Missing party size");
    }

    if (isNaN(Date.parse(reservation_date))) {
      errors.messages.push("Date is not valid");
    }

    if (validUTC < current) {
      errors.messages.push("Date must be in the future");
    }

    if (valid.getDay() === 2) {
      errors.messages.push("The restaurant is closed on tuesdays");
    }

    if (reservation_time < "10:30") {
      errors.messages.push(
        "Choose a later time, the restaurant opens at 10:30 AM"
      );
    }

    if (reservation_time > "21:30") {
      errors.messages.push(
        "Choose an earlier time, the restaurant closes at 9:30 PM"
      );
    }

    if (errors.messages.length > 0) {
      return false;
    }

    return true;
  }

  async function changeHandler(e) {
    //updates form data and sets errors when spotted
    setErrors({ messages: [] });
    const { name, value } = e.target;
    setCurrentReservation({ ...currentReservation, [name]: value });
  }

  async function submitHandler(e) {
    //submits valid form then redirects user to the dashboard date in which reservation was created
    const abortController = new AbortController();
    e.preventDefault();
    const validReservation = validateReservation(currentReservation, errors);

    if (!validReservation) {
      setErrors({ ...errors });
      return errors.messages;
    }
    const reservation = {
      ...currentReservation,
      people: Number(currentReservation.people),
    };

    await createReservation({ data: reservation }, abortController.signal)
      .then(() =>
        history.replace(`/dashboard?date=${reservation.reservation_date}`)
      )
      .catch(setReservationErrors);

    return () => abortController.abort();
  }

  return (
    <>
      <div className="p-2 my-2 bg-dark text-white">
        <div className="row m-2 justify-content-center">
          <div className="col-4.5  p-3 bg-dark text-white">
            <h1 className="m-2">Create your Reservation</h1>
          </div>
        </div>
      </div>
      <div className="p-2 my-2">
        <ErrorAlert error={reservationErrors} />
        <ReservationForm
          reservation={currentReservation}
          submitHandler={submitHandler}
          changeHandler={changeHandler}
          errors={errors}
        />
      </div>
    </>
  );
}
