<?php
class promocion
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado
            $cat = new PromocionModel();
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
            $cat = new PromocionModel();
            $result = $cat->get($param);
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
            $cat = new PromocionModel();
            $result = $cat->get($param);
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
}