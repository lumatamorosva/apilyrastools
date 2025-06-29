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
    //Subir imagen
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
                            error_log("DEBUG - idProduct: $idProduct, fileName: $fileName");
                            $resultado = $this->enlace->ExecuteSQL("UPDATE producto SET Imagen = '$fileName' WHERE IdProducto = $idProduct");
                                if (!$resultado) {
                                    error_log("ERROR - No se pudo actualizar la imagen en la DB", 3, __DIR__ . '/mi_log_personal.log');
                                } else {
                                    error_log("ÉXITO - Imagen actualizada correctamente", 3, __DIR__ . '/mi_log_personal.log');
                                }
                        }
                    }
                }
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Obtener una imagen de una pelicula
    public function getImageMovie($idMovie)
    {
        try {
            
            //Consulta sql
            $vSql = "SELECT * FROM movie_image where movie_id=$idMovie";

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
