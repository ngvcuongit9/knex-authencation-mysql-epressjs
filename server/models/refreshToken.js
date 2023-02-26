const createGuts = require('../helpers/model-guts');

const name = 'RefreshToken';
const tableName = 'tokens2';
const jwt = require('jsonwebtoken');

const selectableProps = [
  'id',
  'refreshToken',
  'user_id',
  'updated_at',
  'created_at',
];

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const verifyRfToken = (token, secretKey) => new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
  const genToken = (userId, secret, tokenLife) => jwt.sign({ id: userId }, secret, {
    expiresIn: tokenLife, // 24 hours
  });

  return {
    ...guts,
    verifyRfToken,
    genToken,
  };
};
