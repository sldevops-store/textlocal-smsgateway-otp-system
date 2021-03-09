const axios = require('axios').default;
const qs = require('qs')

async function sendSms(otp, mobileNumber) {
    try {
        const resp = await axios.get('https://api.textlocal.in/send/',
        { params: {
            apikey: 'VD9N2NVxAlU-BoXb36V0bAxrJq3v4grCmGcMh7RHcD',
            message: otp+' is your OTP to sign in with Trilok Secure. For security reasons please do not share this OTP with anyone.',
            sender: 'TigonF',
            numbers: mobileNumber
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }
        
        );

        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

module.exports = {

    sendSms: sendSms
}