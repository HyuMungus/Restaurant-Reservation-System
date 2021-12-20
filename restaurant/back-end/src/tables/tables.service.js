const knex = require("../db/connection");

function list() {
  return knex("tables").orderBy("table_name").select("*");
}

function create(table) {
  return knex("tables")
    .insert(table, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function read(table_id) {
  return knex("tables")
    .select("tables.*")
    .where({ table_id: table_id })
    .first();
}

function update(table_id, reservation_id) {
  return knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .update({ reservation_id: reservation_id, occupied: true });
}

function seatReservation(table_id, reservation_id) {
  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .where({ reservation_id: reservation_id })
      .update({ status: "seated" })
      .transacting(transaction);
    return knex("tables")
      .where({ table_id: table_id })
      .update({
        occupied: true,
        reservation_id: reservation_id,
      })
      .transacting(transaction)
      .then((records) => records[0]);
  });
}

function unseat(table_id, reservation_id) {
  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .where({ reservation_id: reservation_id })
      .update({ status: "finished" })
      .transacting(transaction);
    return knex("tables")
      .where({ table_id: table_id })
      .update({
        occupied: false,
        reservation_id: null,
      })
      .transacting(transaction)
      .then((records) => records[0]);
  });
}

module.exports = {
  list,
  create,
  read,
  update,
  seatReservation,
  unseat,
};
