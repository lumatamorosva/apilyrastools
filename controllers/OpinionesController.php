<?php
class opiniones
{
    //Traerlos todos
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $genero = new OpinionesModel();
            $result = $genero->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Traer de un producto
    public function get($param)
    {
        try {
            $response = new Response();
            $opins = new OpinionesModel();
            $result = $opins->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $review = new OpinionesModel();
            //Acción del modelo a ejecutar
            $result = $review->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Eliminar
    public function delete($review)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $modelo = new OpinionesModel();
            //Acción del modelo a ejecutar
            $deleted=$modelo->delete($review);
            //Dar respuesta
            if($deleted){
                $response->toJSON(['status'=>200]);
            }else{
                http_response_code(404);
                $response->toJSON(['status'=>404]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            $response->toJSON(['status'=>500,'Error:'=>$e]);
        }
    }
}