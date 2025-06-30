import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'promocion';

class PromocionService {
  getAll() {
    return axios.get(BASE_URL);
  }

  getPromocionById(Id) {
    return axios.get(BASE_URL + '/' + Id);
  }
  getPromocionByReason(Reason) {
    return axios.get(BASE_URL + '/getReason/' + Reason);
  }
}
export default new PromocionService();
