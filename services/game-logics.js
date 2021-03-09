const users = require('./testUsers');
const lastInfo = require('./last-game-info');
const Repository = require('../repository/user-repository');

async function getUserDetails(player){
    var playerDetails = {};
    var user = await Repository.getUser(player.email);

    console.log("DB User: "+ user);
    if(user !==null && user !== undefined){
        if(user.password === player.password){
            playerDetails =  {

                authenticated : true,
                name : user.first_name,
                //lastPrice : user.last_price
                lastPrice : 10
            }
        }else{
            playerDetails =  {

                authenticated : false,
                msg : 'incorrect password'
            }

        }

    }else{
        playerDetails =  {

            authenticated : false,
            msg : 'player does not exist'
        }
    }

    return playerDetails;
}

function getLastGameInfo(){
   
    return lastInfo;
}

function getLastPrice(email){
   
    var lastPrice;
    users.forEach(user1=>{
        if(user1.email === email){
            lastPrice = user1.last_price;
        }
    });

    return lastPrice;
}


async function registerUser(user){
    var dataChunck = {
        name: "REG",
        value: await Repository.registerUser(user)
    }

    return dataChunck;
    
}

module.exports = {

    getUserDetails : getUserDetails,
    getLastGameInfo : getLastGameInfo,
    getLastPrice : getLastPrice,
    registerUser : registerUser
}