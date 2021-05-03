exports.up = function (knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id").primary();
    // insert the actual table below
    table.string("table_name");
    table.integer("capacity");
    table.boolean("occupied").defaultTo(false);
    table.integer("reservation_id");
    table.timestamps(true, true);
    table
      .foreign("reservation_id")
      .references("reservation_id")
      .inTable("reservations");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tables");
};
