const mysql = require('mysql2/promise');
const config = require('../config/configuration');

const pool = mysql.createPool(config);


async function registerUser(user) {
    var sql = "INSERT INTO trilokuserentity (trilokusertokenid, mobilephone1, name, email1) VALUES (?, ?, ?, ?)";

    var uid = makeid(16);
    console.log(uid);
    console.log(JSON.stringify(user))
    const [rows, fields] = await pool.execute(sql, [uid, user.phnNumber, user.name, user.email])
    if (rows.length == 0) {
        console.log("Error: " + err)
        console.log("Cannot enter user to DB...!!!")
        return 1;
    } else {
        console.log('Record succesfully added')
        return 0;
    }
}

async function getUser(phnNumber) {
    try {
        var query = 'SELECT * from trilokuserentity WHERE mobilephone1=?';
        const [raws, fields] = await pool.execute(query, [phnNumber]);
        if (raws.length == 0) return null
        return raws[0]
    } catch (err) {
        console.log("error occured while getting user: " + err)
        return null
    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

module.exports = {

    registerUser: registerUser,
    getUser: getUser

}