<?php
class PromocionModel
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
			$vSql = "SELECT * FROM promocion;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ($vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener una promoción por razón*/
    public function get($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM promocion where AplicaA=$id";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado[0];
            } else {
                throw new Exception("Razón no encontrada con: $id");
            }
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener una promoción por rango de fechas*/
    public function getByDate($inicio,$fin)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM promocion where FechaInicio>=$inicio AND FechaFinal<=$fin";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado[0];
            } else {
                throw new Exception("Promoción no encontrada con aplicación entre: $inicio y $fin");
            }
		} catch (Exception $e) {
            handleException($e);
        }
    }
}
