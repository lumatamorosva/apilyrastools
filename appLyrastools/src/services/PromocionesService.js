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
  createPromocion(Promocion) {
    return axios.post(BASE_URL, JSON.stringify(Promocion));
  }
  deletePromocion(Id) {
    console.log('Eliminando promo:', Id);
    return axios.delete(BASE_URL + '/delete/' + Id);
  }
  updatePromocion(Promocion) {
    return axios.put(BASE_URL, JSON.stringify(Promocion));
  }
}
export default new PromocionService();
