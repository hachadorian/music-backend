exports.up = function (knex) {
  return knex.schema.createTable("user", (table) => {
    table.string("id").primary().notNullable();
    table.string("username").notNullable();
    table.string("email").notNullable();
  });
};

exports.down = function (knex) {};
