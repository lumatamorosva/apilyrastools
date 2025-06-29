import axios from 'axios';
//http://localhost:81/apilyrastools/producto/
const BASE_URL = import.meta.env.VITE_BASE_URL + 'producto';
class ProductoService {
  //Definición para Llamar al API y obtener el listado

  getProductos() {
    return axios.get(BASE_URL);
  }
  //Obtener solo uno
  //localhost:81/apilyrastools/producto/1
  getProductosById(ProductoId){
    return axios.get(BASE_URL+'/'+ProductoId);
  }
  //Obtener peliculas por marca
  //localhost:81/apilyrastools/producto/productoByMarca/1
  getProductosByMarca(Id){
    return axios.get(BASE_URL+'/productoByMarca/'+Id);
  }
  createProducto(Producto) {
    return axios.post(BASE_URL, JSON.stringify(Producto));
  }
  
  updateProducto(Prod) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Prod)

    })
  }
}
export default new ProductoService();
