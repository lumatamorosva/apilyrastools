<?php
class PedidoModel
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
			$vSql = "SELECT * FROM factura;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ($vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener pedidos de un usuario*/
    public function get($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM factura where idCliente=$id";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado;
            } else {
                throw new Exception("Cliente $id no cuenta con pedidos");
            }
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener una pedido*/
    public function getPedido($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM factura where idFactura=$id";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado;
            } else {
                throw new Exception("$id no encontrado");
            }
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Crear factura
     * @param $objeto
     */
    //
    public function create($objeto)
    {
        try {
            //Consulta sql
            $sql = "insert into factura (idFactura,idCliente,fecha,estado,total)".
                    " values ('$objeto->idFactura','$objeto->idCliente','$objeto->fecha','$objeto->estado','$objeto->total')";
            //Ejecutar la consulta
            $Id=$this->enlace->executeSQL_DML_last($sql);
            //Retornar
            return $this->getReview($Id);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /*Listar detalles*/
    public function allDetalles($id){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM detallefactura where IdFact = $id;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ($vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
        /*Obtener una pedido*/
    public function getDireccion($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM direccion where idDireccion=$id";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado;
            } else {
                throw new Exception("$id no encontrado");
            }
		} catch (Exception $e) {
            handleException($e);
        }
    }
}
