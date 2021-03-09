const express = require('express');
const router = express.Router();
const AuthenticateService = require('../services/otp-service');
const tknHanderMdlWare = require('../middleware/token-handler-middleware');
const UserManagementService = require('../services/user-management-service');


router.post('/register', [tknHanderMdlWare.authenticateUser], async(req, res) => await UserManagementService.registerUser(req, res));
router.get('/login', (req, res) => res.render('login'));
router.get('/logout', (req, res) => AuthenticateService.logoutUser(req, res));
router.post('/get-user', [tknHanderMdlWare.authenticateUser], async(req, res) => await UserManagementService.getUser(req, res));

module.exports = router;