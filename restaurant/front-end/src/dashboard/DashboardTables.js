import React, { useState } from "react";
import { finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function DashboardTables({ tables, loadDashboard, loadTables }) {
  const [finishTableErrors, setFinishTableErrors] = useState(null);

  function finishHandler(table_id) {
    //frees up the table in which the user has indicated they have finished with
    if (window.confirm("Is this table ready to seat new guests?")) {
      const abortController = new AbortController();
      setFinishTableErrors(null);
      finishTable(table_id, abortController.signal)
        .then(loadDashboard)
        .then(loadTables)
        .catch(setFinishTableErrors);
      return () => abortController.abort();
    }
  }

  const displayTables = tables.sort().map((table, index) => {
    return (
      <>
        {table.occupied || table.reservation_id ? (
          <tr key={index}>
            <th scope="row">{table.table_id}</th>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td>
              <p data-table-id-status={table.table_id}>Occupied</p>
            </td>
            <td>{table.reservation_id}</td>
            <td>
              <button
                data-table-id-finish={table.table_id}
                className="btn btn-primary"
                onClick={() => finishHandler(table.table_id)}
              >
                Finish
              </button>
            </td>
          </tr>
        ) : (
          <tr key={index}>
            <th scope="row">{table.table_id}</th>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td>
              <p className="col" data-table-id-status={table.table_id}>
                Free
              </p>
            </td>
            <td>{table.reservation_id}</td>
          </tr>
        )}
      </>
    );
  });

  return (
    <>
      <ErrorAlert error={finishTableErrors} />

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Table ID</th>
            <th scope="col">Table Name</th>
            <th scope="col">Table Capacity</th>
            <th scope="col">Status</th>
            <th scope="col">Reservation ID</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>{displayTables}</tbody>
      </table>
    </>
  );
}
