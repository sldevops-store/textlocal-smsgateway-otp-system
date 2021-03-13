import axios from 'axios';
//import AuthHeader from './auth-header';

const API_URL = '/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  // getUserBoard() {
  //   return axios.get(API_URL + 'user', { headers: AuthHeader.authHeader() });
  // }

  // getModeratorBoard() {
  //   return axios.get(API_URL + 'mod', { headers: AuthHeader.authHeader() });
  // }

  // getAdminBoard() {
  //   return axios.get(API_URL + 'admin', { headers: AuthHeader.authHeader() });
  // }
}

export default new UserService();
