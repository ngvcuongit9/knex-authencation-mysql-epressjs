const router = require('express').Router();
const {
  postLogin,
  postRegister,
  refreshToken,
  signOut,
} = require('../controllers/auth_controller');

router.route('/sign-in')
  .post(postLogin);

router.route('/sign-up')
  .post(postRegister);

router.route('/sign-out')
  .post(signOut);

router.route('/refresh-token')
  .post(refreshToken);
module.exports = router;
