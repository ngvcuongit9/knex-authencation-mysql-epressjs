exports.up = async (knex) => {
  await knex.schema.createTable('tokens2', (t) => {
    t.increments('id').primary().unsigned();
    t.string('refreshToken');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.uuid('user_id')
      .references('id')
      .inTable('users2');
  });

  // await knex.schema.table('users2', (t) => {
  //   t.foreign('refreshToken_id')
  //     .references('id')
  //     .inTable('tokens2');
  // });
};
exports.down = (knex) => knex.schema.dropTable('refreshToken2');
