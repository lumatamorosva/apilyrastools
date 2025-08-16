<?php
class pedido
{
    //Traerlos todos
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $res = new PedidoModel();
            $result = $res->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Traer por usuario
    public function get($param)
    {
        try {
            $response = new Response();
            $res = new PedidoModel();
            $result = $res->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Traer uno específico
    public function getPedido($param)
    {
        try {
            $response = new Response();
            $pedido = new PedidoModel();
            $result = $pedido->getPedido($param);
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
            $prod = new PedidoModel();
            //Acción del modelo a ejecutar
            $result = $prod->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Traerlos todos los detalles
    public function allDetalles($id)
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $res = new PedidoModel();
            $result = $res->allDetalles($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
        //Traer uno específico
    public function getDireccion($param)
    {
        try {
            $response = new Response();
            $pedido = new PedidoModel();
            $result = $pedido->getDireccion($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}