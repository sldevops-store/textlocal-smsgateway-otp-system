require('dotenv').config();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const SendSms = require('../services/send-sms-service');

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const SMS_SECRET_KEY = process.env.SMS_SECRET_KEY;

let refreshTokens = [];

async function sendOtp(req, res){

    
    const phnNumber = req.body.phnNumber;
    console.log(phnNumber);
    const otp = Math.floor(100000 + Math.random()*900000);
    const ttl = 2*60*1000;
    const expires = Date.now() + ttl;
    const data = `${phnNumber}.${otp}.${expires}`;
    const hash = crypto.createHmac('sha256', SMS_SECRET_KEY).update(data).digest('hex');
    const fullHash = `${hash}.${expires}`;

    //await SendSms.sendSms(otp, phnNumber);

    return res.status(200).send({hash: fullHash, otp: otp});

}

async function verifyOtp(req, res){

    const phnNumber = req.body.phnNumber;
    const hash = req.body.hash;
    const otp = req.body.otp;

    let [hashValue, expires] = hash.split('.')
    let now = Date.now();

    if(now>parseInt(expires)){
        return res.status(400).send({msg: 'Otp expired. please try again'});
    }

    const data = `${phnNumber}.${otp}.${expires}`;
    const newHash = crypto.createHmac('sha256', SMS_SECRET_KEY).update(data).digest('hex');

    if(newHash === hashValue){
        const accessToken = jwt.sign({ data: phnNumber }, JWT_AUTH_TOKEN, { expiresIn: '30s' });
		const refreshToken = jwt.sign({ data: phnNumber }, JWT_REFRESH_TOKEN, { expiresIn: '1y' });
        refreshTokens.push(refreshToken);
        return res
			.status(200)
			.cookie('accessToken', accessToken, {
				expires: new Date(new Date().getTime() + 30 * 1000),
				sameSite: 'strict',
				httpOnly: true
			})
			.cookie('refreshToken', refreshToken, {
				expires: new Date(new Date().getTime() + 31557600000),
				sameSite: 'strict',
				httpOnly: true
			})
			.cookie('authSession', true, { expires: new Date(new Date().getTime() + 30 * 1000), sameSite: 'strict' })
			.cookie('refreshTokenID', true, {
				expires: new Date(new Date().getTime() + 31557600000),
				sameSite: 'strict'
			})
			.send({varification: true, msg: 'otp verified', accessToken: accessToken, accessTokenExp: new Date().getTime() + 30 * 1000, refreshToken: refreshToken, refreshTokenExp: new Date().getTime() + 31557600000});

    }else{
        return res.status(400).send({verification: false, msg: 'otp not matched'});
    }

}

function getRefreshToken(req, res){

    const refreshToken = req.body.refreshToken;
	if (!refreshToken) return res.status(400).send({ message: 'Refresh token not found, login again' });
	if (!refreshTokens.includes(refreshToken))
		return res.status(400).send({ message: 'Refresh token blocked, login again' });

	jwt.verify(refreshToken, JWT_REFRESH_TOKEN, (err, phnNumber) => {
		if (!err) {
			const accessToken = jwt.sign({ data: phnNumber }, JWT_AUTH_TOKEN, {
				expiresIn: '30s'
			});
			return res
				.status(200)
				.cookie('accessToken', accessToken, {
					expires: new Date(new Date().getTime() + 30 * 1000),
					sameSite: 'strict',
					httpOnly: true
				})
				.cookie('authSession', true, {
					expires: new Date(new Date().getTime() + 30 * 1000),
					sameSite: 'strict'
				})
				.send({ previousSessionExpired: true, success: true, accessToken: accessToken, accessTokenExp: new Date().getTime() + 30 * 1000});
		} else {
			return res.status(400).send({
				success: false,
				msg: 'Invalid refresh token'
			});
		}
	});

}


function logoutUser(req, res){

    res
		.clearCookie('refreshToken')
		.clearCookie('accessToken')
		.clearCookie('authSession')
		.clearCookie('refreshTokenID')
		.send('logout');
}


module.exports = {

    sendOtp: sendOtp,
    verifyOtp: verifyOtp,
    getRefreshToken: getRefreshToken,
    logoutUser: logoutUser
}