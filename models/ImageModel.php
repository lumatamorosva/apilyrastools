<?php
class ImageModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif');
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    //Subir imagen (Listo)
    public function uploadFile($object)
    {
        try {
            $file = $object['file'];
            $idProduct = $object['IdProducto'];
            //Obtener la información del archivo
            $fileName = $file['name'];
            $tempPath = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];

            if (!empty($fileName)) {
                //Crear un nombre único para el archivo
                $fileExt = explode('.', $fileName);
                $fileActExt = strtolower(end($fileExt));
                $fileName = "p" . $idProduct . "." . $fileActExt;
                //Validar el tipo de archivo
                if (in_array($fileActExt, $this->valid_extensions)) {
                    //Validar que no exista
                    if (!file_exists($this->upload_path . $fileName)) {
                        //Subir si es del tamaño correcto
                        if ($fileSize < 2000000 && $fileError == 0) {
                            move_uploaded_file($tempPath, $this->upload_path . $fileName);
                            //Si se sube, actualizar nombre para mostrar
                            $resultado = $this->enlace->ExecuteSQL("UPDATE producto SET Imagen = '$fileName' WHERE IdProducto = $idProduct");
                        }
                    }
                }
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Obtener una imagen de un producto
    public function getImage($idProducto)
    {
        try {
            //Consulta sql
            $vSql = "SELECT Imagen FROM producto where IdProducto=$idProducto";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            if (!empty($vResultado)) {
                // Retornar el objeto
                return $vResultado[0];
            }
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
