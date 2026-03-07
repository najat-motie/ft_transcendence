const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyAccessToken, verifyRefreshToken } = require('../middleware/auth');
const {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateResetPasswordRequest,
  validateResetPasswordComplete,
} = require('../middleware/validation');

const router = express.Router();

router.post(
  '/register',
  validateRegistration,
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);

router.post(
  '/logout',
  verifyRefreshToken,
  authController.logout
);

router.post(
  '/refresh',
  verifyRefreshToken,
  authController.refresh
);

router.post(
  '/reset-password',
  validateResetPasswordRequest,
  handleValidationErrors,
  authController.requestPasswordReset
);

router.post(
  '/reset-password/:token',
  validateResetPasswordComplete,
  handleValidationErrors,
  authController.completePasswordReset
);

router.get(
  '/42',
  authController.oauth42Login
);

router.get(
  '/42/callback',
  authController.oauth42Callback
);

module.exports = router;
