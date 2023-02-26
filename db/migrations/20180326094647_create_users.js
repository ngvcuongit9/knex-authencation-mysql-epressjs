exports.up = (knex) => knex.schema.createTable('users2', (t) => {
  t.increments('id').primary().unsigned();
  t.string('username').unique().index();
  t.string('password');
  t.string('firstName');
  t.string('lastName');
  t.string('email').unique().index();
  t.timestamp('created_at').defaultTo(knex.fn.now());
  t.timestamp('updated_at').defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('users2');
