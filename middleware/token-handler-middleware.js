require('dotenv').config();
const jwt = require("jsonwebtoken");

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;

function authenticateUser(req, res, next) {

    let accessToken = req.headers['x-access-token'];
	console.log("ac: "+ accessToken);

    if(!accessToken){

        return res.status(403).send({
            success: false,
            msg: 'Access token not provided'
        });
    }
	jwt.verify(accessToken, JWT_AUTH_TOKEN, (err, phnNumber) => {
		if (phnNumber) {
			req.phnNumber = phnNumber;
			next();
		} else if (err.message === 'jwt expired') {
			return res.status(403).send({
				success: false,
				msg: 'Access token expired'
			});
		} else {
			console.log(err);
			return res.status(403).send({ err, msg: 'User not authenticated' });
		}
	});
}


module.exports ={

    authenticateUser: authenticateUser
}