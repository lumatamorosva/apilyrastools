import axios from 'axios';
//http://localhost:81/apilyrastools/impuesto/
const BASE_URL = import.meta.env.VITE_BASE_URL + 'impuesto';
class ImpuestoService {
  //Definición para Llamar al API y obtener el listado
  get() {
    return axios.get(BASE_URL);
  }
  //Obtener solo uno
  getImpuesto(Id){
    return axios.get(BASE_URL+'/'+Id);
  }
}
export default new ImpuestoService();
