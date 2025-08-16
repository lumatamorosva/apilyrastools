import axios from 'axios';
//http://localhost:81/apilyrastools/producto/
const BASE_URL = import.meta.env.VITE_BASE_URL + 'pedido';
class PedidoService {
  //Definición para Llamar al API y obtener el listado
  getPedidos() {
    return axios.get(BASE_URL);
  }
  //Obtener por usuario
  getPedidosUsuario(Id){
    return axios.get(BASE_URL+'/'+Id);
  }
  //Obtener pedido único
  getPedido(Id){
    return axios.get(BASE_URL+'/getPedido/'+Id);
  }
  createPedido(Pedido) {
    return axios.post(BASE_URL, JSON.stringify(Pedido));
  }
  //Obtener el listado de detalles de una factura
  getDetalles(Id) {
    return axios.get(BASE_URL+'/allDetalles/'+Id);
  }
    //Obtener direccion
  getDireccion(Id){
    return axios.get(BASE_URL+'/getDireccion/'+Id);
  }
}
export default new PedidoService();
