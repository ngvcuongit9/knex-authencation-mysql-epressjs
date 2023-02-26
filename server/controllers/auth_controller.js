const { User, RefreshToken } = require('../models');
const config = require('../../config/auth.config');

const {
  BAD_REQUEST,
  GENERIC_ERROR,
  CONFLICT,
} = require('../helpers/error_helper');

const postLogin = async (req, res) => {
  try {
    const { username } = req.body;
    const { password } = req.body;
    if (!username || !password) {
      res.status(400).send({
        status: BAD_REQUEST,
        message: '`username` + `password` are required fields',
      });
    }

    await User.verify(username, password)
      .then((data) => {
        if (data.status === 1) {
          res.json(data.data);
        } else {
          res.status(203).send(data.data);
        }
      });
  } catch (error) {
    res.status(500).send({
      status: GENERIC_ERROR,
      message: 'Oh uh, something went wrong',
    });
  }
};

const postRegister = async (req, res) => {
  try {
    const userData = req.body;
    const user = await User.findOne({ username: userData.username });
    if (user) {
      return res.status(CONFLICT).send({
        status: CONFLICT,
        message: 'Username already exists',
      });
    }
    return await User.create(userData).then((data) => res.json({
      ok: true,
      message: 'Registration successful',
      data,
    }));
  } catch (error) {
    res.status(500).send({
      status: GENERIC_ERROR,
      message: 'Oh uh, something went wrong',
    });
  }
};

const signOut = async (req, res) => {
  try {
    try {
      const { body } = req;
      const refToken = await RefreshToken.findOne({ refreshToken: body.refreshToken });
      if ((refToken)) {
        await RefreshToken.destroy(refToken.id);
        res.status(200).json({
          status: 200,
          message: 'oke',
        });
      } else {
        res.status(400).json({
          message: 'Invalid request',
        });
      }
    } catch (error) {
      res.status(500).send({
        status: GENERIC_ERROR,
        message: 'Oh uh, something went wrong',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: GENERIC_ERROR,
      message: 'Oh uh, something went wrong',
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { body } = req;
    const refToken = await RefreshToken.findOne({ refreshToken: body.refreshToken });
    if ((refToken)) {
      try {
        await RefreshToken.verifyRfToken(body.refreshToken, config.refreshTokenSecret);
        await RefreshToken.destroy(refToken.id);
        const response = {
          token: RefreshToken.genToken(refToken.user_id, config.secret_jwt, config.tokenLife),
          refreshToken: RefreshToken.genToken(
            refToken.user_id,
            config.refreshTokenSecret,
            config.refreshTokenLife,
          ),
        };
        await RefreshToken.create({
          refreshToken: response.refreshToken,
          user_id: refToken.user_id,
        });
        res.status(200).json(response);
      } catch (err) {
        res.status(403).json({
          message: 'Invalid refresh token',
        });
      }
    } else {
      res.status(400).json({
        message: 'Invalid request',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: GENERIC_ERROR,
      message: 'Oh uh, something went wrong',
    });
  }
};

module.exports = {
  postLogin,
  postRegister,
  signOut,
  refreshToken,
};
