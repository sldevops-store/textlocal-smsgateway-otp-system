import axios from "axios";
//const cookies = new Cookies();

class AuthHeader{


  authHeader() {

    const accessToken = localStorage.getItem('accessToken');
    //let cok = Cookies.get("accessToken");
    //console.log("Cookie:   "+ cok);
    const accessTokenExp = localStorage.getItem('accessTokenExp');
    console.log("act:::::::::"+ accessTokenExp);
    const refreshToken = localStorage.getItem('refreshToken');
    console.log("Ref"+refreshToken);
    const refreshTokenExp = localStorage.getItem('refreshTokenExp');
  
    if (accessTokenExp > new Date().getTime()) {
      return accessToken;       // for Node.js Express back-end
    } else{
          axios
            .post('/user-authenticate-service/get-refresh-token', {
              withCredentials: true,
              refreshToken: refreshToken
            })
            .then(function(res) {
              console.log(res.data);
              //Cookies.set("accessToken", res.data.accessToken);
              localStorage.setItem("accessToken", res.data.accessToken);
              localStorage.setItem("accessTokenExp", res.data.accessTokenExp);
              window.location.reload();
              console.log("end in auth e=headerS");
              return  res.data.accessToken
            })
            .catch(function(error) {

              console.log(error.response);
              window.location.replace(process.env.LOGIN_HOME_URL);
            })
            return "";
      }
  }

}


export default new AuthHeader();
