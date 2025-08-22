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
    //Traerlos vendidos
    public function getVendidos()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $res = new PedidoModel();
            $result = $res->getVendidos();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
        //Traerlos vendidos
    public function getVendidosHoy()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $res = new PedidoModel();
            $result = $res->getVendidosHoy();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Traerlos total del día
    public function getTotalHoy()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $res = new PedidoModel();
            $result = $res->getTotalHoy();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Traerlos estados de las facturas
    public function getEstados()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $res = new PedidoModel();
            $result = $res->getEstados();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Traer Top3
    public function gettop3()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $res = new PedidoModel();
            $result = $res->getTop();
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
            if (!isset($inputJSON->pedido) || !isset($inputJSON->detalles)) {
                throw new Exception("JSON inválido: faltan 'pedido' o 'detalles'");
            }
            $pedido = $inputJSON->pedido;
            $detalles = $inputJSON->detalles;
            //Instancia del modelo
            $prod = new PedidoModel();
            //Acción del modelo a ejecutar
            $result = $prod->create($pedido,$detalles);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
        //PATCH actualizar
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $objeto = new PedidoModel();
            //Acción del modelo a ejecutar
            $result = $objeto->update($inputJSON);
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