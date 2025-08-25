<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
use Firebase\JWT\JWT;
class UserModel
{
	public $enlace;
	public function __construct()
	{$this->enlace = new MySqlConnect();}
	public function all()
	{
		try {
			//Consulta sql
			$vSql = "SELECT * FROM usuario;";
			//Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL($vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}

	public function get($id)
	{
		try {
			//Consulta sql
			$vSql = "SELECT * FROM usuario where IdUsuario=$id";
			//Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL($vSql);
			if ($vResultado) {
				$vResultado = $vResultado[0];
				// Retornar el objeto
				return $vResultado;
			} else {
				return null;
			}
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}
	public function allClientes()
	{
		try {
			//Consulta sql
			$vSql = "SELECT * FROM usuario where Tipo=5;";
			//Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL($vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}
	public function allVendedores()
	{
		try {
			//Consulta sql
			$vSql = "SELECT * FROM usuario where Tipo=4;"; 
			//Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL($vSql); 
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}
	public function login($objeto)
	{
		try {
			$vSql = "SELECT * from usuario where UserName='$objeto->userName'";
			error_log("SQL login: " . $vSql);
			//Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL($vSql);
			if (!empty($vResultado) && is_object($vResultado[0])) {
				$user = $vResultado[0];
				if (password_verify($objeto->password, $user->Password)) {
					$usuario = $this->get($user->IdUsuario);
					if (!empty($usuario)) {
						// Datos para el token JWT
						$data = [
							'id' => $usuario->IdUsuario,
							'userName' => $usuario->UserName,
							'rol' => $usuario->Tipo,
							'iat' => time(),  // Hora de emisión
							'exp' => time() + 3600 // Expiración en 1 hora
						];
						// Generar el token JWT
						$jwt_token = JWT::encode($data, config::get('SECRET_KEY'), 'HS256');
						// Enviar el token como respuesta
						return $jwt_token;
					}
				}
			} else {
				return false;
			}
		} catch (Exception $e) {
			handleException($e);
		}
	}
	public function create($objeto)
	{
		try {
			if (isset($objeto->Password) && $objeto->Password != null) {
				$crypt = password_hash($objeto->Password, PASSWORD_BCRYPT);
				$objeto->Password = $crypt;
			}
			//Consulta sql            
			$vSql = "insert into usuario (IdUsuario,Nombre,Apellido,Correo,Tipo,FechaNacimiento,UserName,Password)" .
				" values ($objeto->IdUsuario,'$objeto->Nombre','$objeto->Apellido','$objeto->Email',$objeto->Tipo,'$objeto->FechaNacimiento','$objeto->UserName','$objeto->Password')";
				//Ejecutar la consulta
			$vResultado = $this->enlace->executeSQL_DML_last($vSql);
			error_log("Resultado de executeSQL_DML_last: " . print_r($vResultado, true));
			// Retornar el objeto creado
			return $this->get($vResultado);
		} catch (Exception $e) {
			handleException($e);
		}
	}
//Cambiar password
		public function changePass($objeto)
	{
		try {
			if (isset($objeto->password) && $objeto->password != null) {
				$crypt = password_hash($objeto->password, PASSWORD_BCRYPT);
				$objeto->password = $crypt;
			}
			//Consulta sql            
			$vSql = "update usuario set Password = '$objeto->password' where IdUsuario='$objeto->Id';";
			var_dump($objeto);
            echo $vSql; 
			//Ejecutar la consulta
			$vResultado = $this->enlace->executeSQL_DML_last($vSql);
			// Retornar el objeto creado
			return $this->get($objeto->Id);
		} catch (Exception $e) {
			error_log("❌ Excepción en UserModel: " . $e->getMessage());
        throw $e;
		}
	}
}
