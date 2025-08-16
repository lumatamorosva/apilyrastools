<?php
class impuesto
{
    //Traerlos todos
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $imp = new ImpuestoModel();
            $result = $imp->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Traer uno específico
    public function get($param)
    {
        try {
            $response = new Response();
            $imp = new ImpuestoModel();
            $result = $imp->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}