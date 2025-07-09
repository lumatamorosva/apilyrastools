<?php
class promocion
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado
            $promocion = new PromocionModel();
            $result = $promocion->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function get($param)
    {
        try {
            $response = new Response();
            $promocion = new PromocionModel();
            $result = $promocion->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getReason($param)
    {
        try {
            $response = new Response();
            $promocion = new PromocionModel();
            $result = $promocion->getByRazon($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getByDate($inicio,$fin)
    {
        try {
            $response = new Response();
            $cat = new PromocionModel();
            $result = $cat->getByDate($inicio,$fin);
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
            $prod = new PromocionModel();
            //Acción del modelo a ejecutar
            $result = $prod->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Eliminar
    public function delete($promo)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $modelo = new PromocionModel();
            //Acción del modelo a ejecutar
            $deleted=$modelo->delete($promo);
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