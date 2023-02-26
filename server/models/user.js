const bcrypt = require('bcrypt');
const createGuts = require('../helpers/model-guts');

const name = 'User';
const tableName = 'users2';
const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');

// Properties that are allowed to be selected from the database for reading.
// (e.g., `password` is not included and thus cannot be selected)
const selectableProps = [
  'id',
  'username',
  'email',
  'updated_at',
  'created_at',
];

const selectableProRefreshTk = [
  'id',
  'refreshToken',
  'user_id',
  'updated_at',
  'created_at',
];

// Bcrypt functions used for hashing password and later verifying it.
const SALT_ROUNDS = 10;
const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
const verifyPassword = (password, hash) => bcrypt.compare(password, hash);
// let isMatch = false;
// Always perform this logic before saving to db. This includes always hashing
// the password field prior to writing so it is never saved in plain text.
const beforeSave = (user) => {
  if (!user.password) return Promise.resolve(user);

  // `password` will always be hashed before being saved.
  return hashPassword(user.password)
    .then((hash) => ({ ...user, password: hash }))
    .catch((err) => `Error hashing password: ${err}`);
};

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  // Augment default `create` function to include custom `beforeSave` logic.
  const create = (props) => beforeSave(props)
    .then((user) => guts.create(user));

  const verify = async (username, password) => {
    const user = await knex.select()
      .from(tableName)
      .where({ username })
      .timeout(guts.timeout);

    if (user.length < 1) {
      return {
        status: 0,
        data: {
          message: 'username invalid',
        },
      };
    }

    const isVerify = await verifyPassword(password, user[0].password);
    if (user && isVerify) {
      const tokenJwt = jwt.sign({ id: user.id }, config.secret_jwt, {
        expiresIn: config.tokenLife, // 24 hours
      });
      const refreshToken = jwt.sign({ id: user.id }, config.refreshTokenSecret, {
        expiresIn: config.refreshTokenLife,
      });
      const modelRefToken = {
        refreshToken,
        user_id: user[0].id,
      };
      await knex.insert(modelRefToken)
        .returning(selectableProRefreshTk)
        .into('tokens2')
        .timeout(1000);
      return {
        status: 1,
        data: {
          user: {
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            email: user[0].email,
            displayName: user[0].firstName + user[0].lastName,
          },
          message: 'Login successful',
          token: tokenJwt,
          refreshToken,
        },
      };
    }
    return {
      status: 0,
      data: {
        message: 'Password not correct',
      },
    };
  };
  return {
    ...guts,
    create,
    verify,
  };
};
