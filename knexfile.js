// ref: https://devhints.io/knex
// TODO: implement more dynamic env var settings loader
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '178.128.109.9',
      port: 3306,
      user: 'test01',
      password: 'PlsDoNotShareThePass123@',
      database: 'entrance_test',
    },
    migrations: {
      tableName: 'knex_migrations1',
      directory: `${__dirname}/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/db/seeds`,
    },
  },
};
