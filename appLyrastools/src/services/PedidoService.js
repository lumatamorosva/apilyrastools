import axios from 'axios';
//http://localhost:81/apilyrastools/pedido/
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
  getVendidos() {
    return axios.get(BASE_URL+'/getVendidos/');
  }
  getVendidosHoy() {
    return axios.get(BASE_URL+'/getVendidosHoy/');
  }
  getTotalHoy() {
    return axios.get(BASE_URL+'/getTotalHoy/');
  }
  getEstados() {
    return axios.get(BASE_URL+'/getEstados/');
  }
  getTop3() {
    return axios.get(BASE_URL+'/getTop3/');
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
  create(Pedido) {
    return axios.post(BASE_URL, JSON.stringify(Pedido));
  }
    updatePedido(Pedido) {
    console.log('Actualizando pedido:', Pedido.IdPedido);
    return axios.patch(BASE_URL + '/patch/'+ Pedido.IdPedido, JSON.stringify(Pedido));
  }
}
export default new PedidoService();
