import axios from 'axios';
//http://localhost:81/apilyrastools/opiniones/
const BASE_URL = import.meta.env.VITE_BASE_URL + 'opiniones';
class ReviewService {
  //Definición para Llamar al API y obtener el listado
  getOpiniones() {
    return axios.get(BASE_URL);
  }
  getRecientes() {
    return axios.get(BASE_URL+'/getRecientes/');
  }
  //Obtener opiniones de un producto
  getById(ProductoId){
    return axios.get(BASE_URL+'/'+ProductoId);
  }

  createReview(Review) {
    return axios.post(BASE_URL, JSON.stringify(Review));
  }
  updateReview(Review) {
    console.log('Actualizando :', Review.Id);
    return axios.patch(BASE_URL + '/patch/'+ Review.Id, JSON.stringify(Review));
  }
  deleteReview(Id) {
    console.log('Eliminando reseña:', Id);
    return axios.delete(BASE_URL + '/delete/' + Id);
  }
}
export default new ReviewService();
