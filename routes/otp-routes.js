const express = require('express');
const router = express.Router();
const OtpService = require('../services/otp-service');


router.post('/send-otp', (req, res) => OtpService.sendOtp(req, res));

router.post('/verify-otp', (req, res) => OtpService.verifyOtp(req, res));

router.post('/get-refresh-token', (req, res) => OtpService.getRefreshToken(req, res));

module.exports = router;