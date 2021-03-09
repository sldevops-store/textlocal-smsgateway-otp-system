import axios from "axios";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const { LOGIN_HOME_URL} = process.env;

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {

  constructor() {
		this.authenticated = false;
	}

  isAuthenticated() {
		const accessTokenExp = localStorage.getItem('accessTokenExp');
    console.log("act11:::::::::"+ accessTokenExp);
		const refreshTokenExp = localStorage.getItem('refreshTokenExp');
    const refreshToken = localStorage.getItem('refreshToken');
		if ((accessTokenExp < new Date().getTime()) && (refreshTokenExp < new Date().getTime())) {
      console.log("Falils");
			return false;
		}
		if ((accessTokenExp > new Date().getTime()) && (refreshTokenExp > new Date().getTime())) {
      console.log("Pass");
			return true;
		}
		if ((accessTokenExp < new Date().getTime()) && (refreshTokenExp > new Date().getTime())) {
			axios
				.post('http://localhost:8080/user-authenticate-service/get-refresh-token', {
					withCredentials: true,
          refreshToken: refreshToken
				})
				.then(function(res) {
					console.log("GetRefresh: "+res.data);
					if(res.data.success){
            console.log("ACS succcess"+res.data.accessToken);
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("accessTokenExp", res.data.accessTokenExp);
            console.log("end Success");
            window.location.reload();
            return true;
          }
          window.location.replace(LOGIN_HOME_URL);
          console.log("getRefresh false"+res.data);
          return false;
				},
        err=>{
          window.location.replace(LOGIN_HOME_URL);
          console.log("getRefresh false"+err.response);
          return false;
        }
        )
				.catch(function(error) {
          window.location.replace(LOGIN_HOME_URL);
          console.log(error.response);
          return false;
				});
		}
	}

  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessTokenExp");
		localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshTokenExp");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    console.log('cirrent user');
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
