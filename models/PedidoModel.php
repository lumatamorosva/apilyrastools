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
            $id = intval($id);
            if (is_numeric($id)){
			$vSql = "SELECT * FROM factura where idCliente=$id";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado;
            } else {
                throw new Exception("Cliente $id no cuenta con pedidos");
            }}
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener pedidos vendidos*/
    public function getVendidos()
    {
        try {
            //Consulta sql
			$vSql = "SELECT p.NombreProducto,COUNT(df.IdProducto) AS Cantidad FROM producto p
                        JOIN detallefactura df ON p.IdProducto = df.IdProducto JOIN factura f ON df.IdFact = f.idFactura
                        WHERE f.estado = 2 GROUP BY p.NombreProducto;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado;
            } else {
                throw new Exception("No se ha vendido ningún producto");}
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener pedidos vendidos de hoy*/
    public function getVendidosHoy()
    {
        try {
            //Consulta sql
			$vSql = "SELECT p.NombreProducto,COUNT(df.IdProducto) AS Cantidad FROM producto p
                        JOIN detallefactura df ON p.IdProducto = df.IdProducto JOIN factura f ON df.IdFact = f.idFactura
                        WHERE f.estado = 2 AND DATE(f.fechaPago) = CURDATE() GROUP BY p.NombreProducto;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado;
            } else {
                return [];}
		} catch (Exception $e) {
            handleException($e);
        }
    }
        /*Obtener Top 3*/
    public function getTop()
    {
        try {
            //Consulta sql
			$vSql = "SELECT p.NombreProducto,COUNT(df.IdProducto) AS CantidadVendida
                        FROM producto p JOIN detallefactura df ON p.IdProducto = df.IdProducto
                        GROUP BY p.IdProducto, p.NombreProducto ORDER BY CantidadVendida DESC
                        LIMIT 3;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado;
            } else {
                return [];}
		} catch (Exception $e) {
            handleException($e);
        }
    }
     /*Obtener pedidos de hoy por precio*/
    public function getTotalHoy()
    {
        try {
            //Consulta sql
			$vSql = "SELECT f.idFactura,SUM(f.total) AS TotalFactura
                    FROM factura f JOIN detallefactura df ON f.idFactura = df.IdFact
                    WHERE f.estado = 2 AND f.fechaPago = CURDATE() GROUP BY f.idFactura;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado;
            } else {
                return [];}
		} catch (Exception $e) {
            handleException($e);
        }
    }
         /*Obtener pedidos de hoy por precio*/
    public function getEstados()
    {
        try {
            //Consulta sql
			$vSql = "SELECT estado, COUNT(*) AS cantidad FROM factura GROUP BY estado;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado;
            } else {
                throw new Exception("No hay facturas");}
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
    public function create($objeto,$detalles)
    {
        try {
            //Consulta sql
            $sql = "insert into factura (idCliente,fechaCreacion,estado,total,idEntrega)".
                    " values ('$objeto->idCliente','$objeto->fechaCreacion','$objeto->estado','$objeto->total','$objeto->idEntrega')";
            //Ejecutar la consulta
            $Id=$this->enlace->executeSQL_DML_last($sql);
            //Generar detalles
            error_log("Detalles recibidos: " . print_r($detalles, true));
            if($this->getPedido($Id)){
                for($i = 0; $i < count($detalles); $i++){
                    $item = $detalles[$i];
                    $precioC = $item->cantidad * $item->Precio;
                    $precioD = $precioC / 500;
                    $sql = "insert into detallefactura (IdFact,IdProducto,Cantidad,PrecioIndividual,PrecioColones,PrecioDolares,IdImpuesto)".
                    " values ('$Id','{$item->IdProducto}','{$item->cantidad}','{$item->Precio}','$precioC','$precioD','1')";
                    $Insertado=$this->enlace->executeSQL_DML_last($sql);
                }
            //Retornar
            return $this->getPedido($Id);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Actualizar 
     * @param $objeto a actualizar
     * @return $this->get($idProducto) - Objeto producto
     */
    //
    public function update($objeto)
    {
        try {
            //Consulta sql
            $sql = "Update factura SET fechaPago='$objeto->Fecha',estado='$objeto->Estado'
                    Where idFactura='$objeto->IdPedido'";
            //Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);
            //Retornar
            return $this->get($objeto->IdPedido);
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
