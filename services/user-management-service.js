const Repository = require('../repository/user-repository');


async function getUser(req, res){
    var user = await Repository.getUser(req.body.phnNumber);
    console.log("DB User: "+ user);
    console.log("DB User mob: "+ req.body.phnNumber);
    if(user !==null && user !== undefined){
                userDetails =  {

                    registered : true,
                    name : user.name,
                    email : user.email1,
                    trilokId : user.trilokusertokenid,
                    phnNumber : user.mobilephone1
                }

    }else{
        userDetails =  {

            registered : false,
            phnNumber: req.body.phnNumber,
            msg : 'user does not exist'
        }
    }

    return  res.status(200).send(userDetails);
}


async function registerUser(req, res){

    var user = {

        phnNumber: req.body.phnNumber,
        name: req.body.username,
        email: req.body.email

    }
    var response = await Repository.registerUser(user);
    console.log("DB User Reg: "+ response);
    //console.log("DB User mob: "+ req.body.phnNumber);
    if(response===0){
                userDetails =  {

                    success : true,
                    phnNumber : user.phnNumber,
                    msg: "User sucessfuly added"
                }

    }else{
        userDetails =  {

            success : false,
            phnNumber : user.phnNumber,
            msg: "error in registering user"
        }
    }

    return  res.status(200).send(userDetails);
}

module.exports = {
    getUser:getUser,
    registerUser: registerUser
}