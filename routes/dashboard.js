const express = require('express');
const router = express.Router();
const tknHanderMdlWare = require('../middleware/token-handler-middleware');


router.get('/home', [tknHanderMdlWare.authenticateUser], (req, res) => res.status(200).send("<>User DashBoard Home Content."));

module.exports = router;