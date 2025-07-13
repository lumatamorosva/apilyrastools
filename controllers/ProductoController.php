<?php
class producto
{
    //Traerlos todos
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $genero = new ProductoModel();
            $result = $genero->all();
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
            $genero = new ProductoModel();
            $result = $genero->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Traerlos filtrados por marca
    public function productoByMarca($param)
    {
        try {
            $response = new Response();
            $marca = new ProductoModel();
            $result = $marca->getByMarca($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Top 10 mejor calificados
    public function getTop10()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $producto = new ProductoModel();
            $result = $producto->getTop();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Obtener cantidad de productos por categoria
    public function getCountByGenre($param)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $movie = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $movie->getCountByCategoria($param);
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
            $prod = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $prod->create($inputJSON);
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
            $prod = new ProductoModel();
            //Acción del modelo a ejecutar
            $result = $prod->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}