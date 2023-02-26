const router = require('express').Router();
const {
  postLogin,
  postRegister,
  refreshToken,
  signOut,
} = require('../controllers/auth_controller');

router.route('/login')
  .post(postLogin);

router.route('/register')
  .post(postRegister);

router.route('/sign-out')
  .post(signOut);

router.route('/refreshToken')
  .post(refreshToken);
module.exports = router;
