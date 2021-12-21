exports.up = function (knex) {
  return knex.schema.createTable("songs", (table) => {
    table.string("id").primary().notNullable();
    table.string("userid").references("id").inTable("user");
    table.string("name").notNullable();
    table.string("genre").notNullable();
    table.string("url").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("songs");
};
