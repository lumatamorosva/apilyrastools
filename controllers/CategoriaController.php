<?php
class categoria
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado
            $cat = new CategoriaModel();
            $result = $cat->all();
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
            $cat = new CategoriaModel();
            $result = $cat->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }}