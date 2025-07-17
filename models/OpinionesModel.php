<?php
class OpinionesModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all(){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM opiniones;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ($vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener reviews de un Producto*/
    public function get($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM opiniones where IdProducto=$id";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado[0];
            } else {
                throw new Exception("Producto $id no cuenta con opiniones");
            }
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Crear review
     * @param $objeto review a insertar
     */
    //
    public function create($objeto)
    {
        try {
            //Consulta sql
            $sql = "insert into opiniones (IdProducto,IdCliente,Opinion,Calificacion)".
                    " values ('$objeto->IdProducto','$objeto->IdCliente','$objeto->Opinion','$objeto->Calificacion')";
            //Ejecutar la consulta
            //Obtener ultimo insert
            $IdProducto=$this->enlace->executeSQL_DML_last($sql);
            //Retornar producto
            return $this->get($IdProducto);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Eliminar opinion
     * @param $Id review a eliminar
     * @return $this->get($Id) - Objeto
     */
    //
    public function delete($Id)
    {
        try {
            //Consulta sql
            $sql = "delete from opiniones where Id = $Id;";
            //Ejecutar el sql
            $this->enlace->executeSQL_DML_last($sql);
            //Retornar
            return true;
        } catch (Exception $e) {
            throw new Exception("Fallo eliminación: " . $e->getMessage());
        }
    }
}
