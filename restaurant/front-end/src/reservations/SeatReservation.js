import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { listTables, updateTableStatus, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";

export default function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [currentTableID, setCurrentTableID] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesErrors, setTablesErrors] = useState("");
  const [currentReservation, setCurrentReservation] = useState({});
  const [currentReservationErrors, setCurrentReservationErrors] =
    useState(null);

  useEffect(loadTables, []);
  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    setCurrentReservationErrors(null);
    readReservation(reservation_id, abortController.signal)
      .then(setCurrentReservation)
      .catch(setCurrentReservationErrors);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesErrors(null);
    listTables(abortController.signal)
      .then((tables) => {
        setTables(tables);
        setCurrentTableID(tables[0].table_id);
      })
      .catch(setTablesErrors);
    return () => abortController.abort();
  }

  function changeHandler({ target }) {
    //sets the table ID that was selected
    setCurrentTableID(target.value);
    console.log(currentTableID);
  }

  function submitHandler(e) {
    //submits the seating and validates that the table capacity is larger than the party size
    e.preventDefault();
    const abortController = new AbortController();
    setTablesErrors(null);
    let foundTable = tables.find(
      (table) => table.table_id === Number(currentTableID)
    );

    if (currentReservation.people > foundTable.capacity) {
      setTablesErrors({
        message:
          "Party size is larger than table capacity, please choose another table.",
      });
      return;
    }
    updateTableStatus(
      currentTableID,
      { data: { reservation_id } },
      "PUT",
      abortController.signal
    )
      .then(() => {
        history.push({
          pathname: "/dashboard",
          search: `?date=${currentReservation.reservation_date}`,
        });
      })
      .catch(setTablesErrors);
    return () => abortController.abort();
  }

  const tableOptions = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  return (
    <>
      <div className="p-2 my-2 bg-dark text-white">
        <div className="row m-2 justify-content-center">
          <div className="col-4.5  p-3 bg-dark text-white">
            <h1 className="m-2">Seat Reservation</h1>
          </div>
        </div>
      </div>
      <div className="p-3 my-2 bg-dark text-white">
        <div className="row my-4 justify-content-center">
          <div className="col-2 align-self-center border border-dark p-2">
            <div className="row justify-content-center">
              <h4>Reservation Info:</h4>
            </div>
            <div className="row justify-content-center">
              <h4>
                {currentReservation.first_name} {currentReservation.last_name}
              </h4>
            </div>
            <div className="row justify-content-center">
              <h4>{currentReservation.people} people</h4>
            </div>
          </div>
        </div>
        <div className="row my-1 justify-content-center">
          <div className="col-2 align-self-center border border-dark p-2">
            <div className="row justify-content-center">
              <h4>Phone Number: </h4>
            </div>
            <div className="row justify-content-center">
              <h4>{currentReservation.mobile_number}</h4>
            </div>
          </div>
        </div>
        <div className="p-3 my-2 bg-dark text-white border border-dark">
          <div className="row justify-content-center">
            <div className="col-4.5 m-2 p-1">
              <h3>Select Table: </h3>
              <form>
                <label>Table: </label>
                <select
                  name="table_id"
                  onChange={changeHandler}
                  value={currentTableID}
                  className="form-select form-select-lg mb-2"
                >
                  {tableOptions}
                </select>
              </form>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className=" p-1">
              <button
                type="submit"
                onClick={submitHandler}
                className="btn btn-primary"
              >
                Confirm
              </button>
            </div>
            <div className="p-1">
              <button
                type="cancel"
                onClick={() => history.push(`/dashboard?date=${today()}`)}
                className="btn btn-danger mb-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <ErrorAlert error={tablesErrors} />
      <ErrorAlert error={currentReservationErrors} />
    </>
  );
}
