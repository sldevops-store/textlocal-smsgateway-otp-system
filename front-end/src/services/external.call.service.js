import axios from "axios";
import AuthHeader from './auth-header';

const API_DASHBOARD_URL = "/dashboard/";
const API_USER_URL = "/users/";

class ExternalCallService {


  getDashboardHome() {
    console.log('Dashboard Home');
    return axios
        .get("https://139.59.38.45"+API_DASHBOARD_URL + "home", { headers: {'x-access-token': AuthHeader.authHeader()} });
        
  }

  userIsRegistered() {
    console.log('check Login-IsRegisted user');
    return axios
        .post(API_USER_URL + "get-user",
            { phnNumber: localStorage.getItem('phnNumber')},
            { headers: {'x-access-token': AuthHeader.authHeader()} });
        
  }

  userRegister(username, email, phnNumber) {
    console.log('Login-Register user'+phnNumber);
    return axios
        .post("https://139.59.38.45"+API_USER_URL + "register",
        {
            username,
            email,
            phnNumber
        },
        { headers: {'x-access-token': AuthHeader.authHeader()} });
        
  }
}

export default new ExternalCallService();
