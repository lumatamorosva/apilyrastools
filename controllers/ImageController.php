<?php
//class Genre
class image{
    //POST (Pasar imagen a la carpeta uploads al crear producto)
    public function create()
    {
        try {
            /* $file=null;
            if (isset($_FILES['file'])){
                $file = $_FILES['file'];
            } */
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputFILE = $request->getBody();
            //Instancia del modelo
            $product = new ImageModel();
            //Acción del modelo a ejecutar
            $result = $product->uploadFile($inputFILE);
           
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}