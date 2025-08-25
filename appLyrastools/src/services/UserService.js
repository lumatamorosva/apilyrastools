import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'user';

class UserService {
  getUsers() {
    return axios.get(BASE_URL);
  }
  getUserById(UserId) {
    return axios.get(BASE_URL + '/' + UserId);
  }
  getAllCustomer() {
    return axios.get(BASE_URL + '/allCustomer/');
  }
  getAllVendedores() {
    return axios.get(BASE_URL + '/allVendedores/');
  }
  createUser(User) {
    return axios.post(BASE_URL, JSON.stringify(User));
  }
  changing(User) {
    console.log('Actualizando usuario:', User.password);
    console.log(`${BASE_URL}/patch/${User.Id}`);
    return axios.patch(BASE_URL + '/patch/'+ User.Id, JSON.stringify(User));
  }
  loginUser(User) {
    return axios.post(BASE_URL + '/login/', JSON.stringify(User));
  }
}
export default new UserService();
