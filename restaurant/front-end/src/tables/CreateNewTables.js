import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

export default function CreateTable() {
  const history = useHistory();
  const [newTable, setNewTable] = useState({});

  function changeHandler(e) {
    //updates the form based on what the user is inputting
    const { name, value } = e.target;
    setNewTable({ ...newTable, [name]: value });
  }

  async function submitHandler(e) {
    //submits the form and creates the table then redirects the user back to the dashboard
    const abortController = new AbortController();

    e.preventDefault();
    const table = {
      ...newTable,
      capacity: Number(newTable.capacity),
    };
    await createTable({ data: table }, abortController.signal).then(() => {
      history.replace(`/dashboard`);
    });

    return () => {
      abortController.abort();
    };
  }

  return (
    <>
      <div className="p-2 my-2 bg-dark text-white">
        <div className="row m-2 justify-content-center">
          <div className="col-4.5  p-3 bg-dark text-white">
            <h1 className="m-2">Create a Table</h1>
          </div>
        </div>
      </div>
      <div className="p-2 my-2">
        <form>
          <div className="mb-2">
            <label for="table_name" className="form-label">
              Table Name:
            </label>
            <input
              type="text"
              className="form-control"
              name="table_name"
              id="table_name"
              placeholder="Table Name"
              value={newTable?.table_name}
              onChange={changeHandler}
            />
          </div>
          <div className="mb-2">
            <label for="capacity" className="form-label">
              Table Capacity:
            </label>
            <input
              type="number"
              min="1"
              pattern="\d+"
              className="form-control"
              name="capacity"
              id="capacity"
              placeholder="10"
              value={newTable?.capacity}
              onChange={changeHandler}
            />
          </div>
          <button
            onClick={() => history.goBack()}
            type="button"
            className="btn btn-danger"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={submitHandler}
            className="btn btn-primary m-2"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
