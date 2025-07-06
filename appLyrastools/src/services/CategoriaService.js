import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'categoria';

class CategoriaService {
  getCategorias() {
    return axios.get(BASE_URL);
  }
  getCategoriaById(CatId) {
    return axios.get(BASE_URL + '/' + CatId);
  }
  getProductobyCategoria(CatId) {
    return axios.get(BASE_URL + '/productoByCategoria/' + CatId);
  }
}
export default new CategoriaService();
