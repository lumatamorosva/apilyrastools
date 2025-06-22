import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'marca';

class MarcaService {
  getMarcas() {
    return axios.get(BASE_URL);
  }

  getMarcaById(MarcaId) {
    return axios.get(BASE_URL + '/' + MarcaId);
  }
  getProductobyMarca(MarcaId) {
    return axios.get(BASE_URL + '/productoByMarca/' + MarcaId);
  }
}

export default new MarcaService();
