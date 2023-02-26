const { User } = require('../../server/models');

exports.seed = (knex) => knex(User.tableName).del()
  .then(() => [
    {
      username: 'admin',
      password: 'password',
      firstName: 'test1',
      lastName: 'osad',
      email: 'admin@email.com',
    },
    {
      username: 'first-user',
      password: 'another-password',
      firstName: 'test2',
      lastName: 'happier',
      email: 'first-user@email.com',
    },
  ])
  .then((newUsers) => Promise.all(newUsers.map((user) => User.create(user))))
  .catch((err) => console.log('err: ', err));
