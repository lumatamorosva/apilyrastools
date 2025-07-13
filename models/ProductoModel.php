<?php
class ProductoModel
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
			$vSql = "SELECT * FROM producto;";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ($vSql);
				
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener un producto*/
    public function get($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM producto where IdProducto=$id";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
            if ($vResultado && count($vResultado) > 0) {
                return $vResultado[0];
            } else {
                throw new Exception("Producto no encontrado con ID: $id");
            }
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener productos por marca*/
    public function getByMarca($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM producto where Marca=$id";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado[0];
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Obtener la cantidad de productoss por categoria
     * @param 
     * @return $vresultado - Cantidad de productos por categoria
     */
    //
    public function getCountByCategoria()
    {
        try {

            $vResultado = null;
            //Consulta sql
            $vSql = "SELECT count(p.Categoria) as 'Cantidad', c.Nombre as 'Categoria'
			FROM categoria c, producto p
			where p.Categoria=c.IdCategoria
			group by c.Nombre";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Obtener los 10 mejores calificados
     * @param 
     * @return $vresultado - 10 productos con mejor calificación
     */
    //
    public function getTop()
    {
        try {
            $vResultado = null;
            //Consulta sql
            $vSql = "SELECT * from producto order by Calificacion DESC Limit 10";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Crear producto
     * @param $objeto producto a insertar
     * @return $this->get($IdProducto) - Objeto producto
     */
    //
    public function create($objeto)
    {
        try {
            //Consulta sql
            //Identificador autoincrementable
            $sql = "insert into producto (NombreProducto,Marca,Categoria,Existencias,Precio,Imagen,Descripcion,IdPromocion)".
                    " values ('$objeto->NombreProducto','$objeto->Marca','$objeto->Categoria','$objeto->Existencias','$objeto->Precio','$objeto->Imagen','$objeto->Descripcion','$objeto->IdPromocion')";

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
     * Actualizar producto
     * @param $objeto producto a actualizar
     * @return $this->get($idProducto) - Objeto producto
     */
    //
    public function update($objeto)
    {
        try {
            //Consulta sql
            $sql = "Update producto SET NombreProducto='$objeto->NombreProducto',Marca='$objeto->Marca',Categoria='$objeto->Categoria',Existencias='$objeto->Existencias',Precio='$objeto->Precio',Imagen='$objeto->Imagen',Descripcion='$objeto->Descripcion',IdPromocion='$objeto->IdPromocion'
                    Where IdProducto='$objeto->IdProducto'";

            //Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);
            //Retornar pelicula
            return $this->get($objeto->IdProducto);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Eliminar producto
     * @param $IdProducto producto a eliminar
     * @return $this->get($IdProducto) - Objeto
     */
    //
    public function delete($IdProducto)
    {
        try {
            //Consulta sql
            $sql = "delete from producto where IdProducto = $IdProducto;";
            //Ejecutar el sql
            $this->enlace->executeSQL_DML_last($sql);
            //Retornar producto
            return true;
        } catch (Exception $e) {
            throw new Exception("Fallo eliminación: " . $e->getMessage());
        }
    }
}
