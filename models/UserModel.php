<?php
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
			$rolM = new RolModel();

			//Consulta sql
			$vSql = "SELECT * FROM usuario where id=$id";
			//Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL($vSql);
			if ($vResultado) {
				$vResultado = $vResultado[0];
				$rol = $rolM->getRolUser($id);
				$vResultado->rol = $rol;
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
			$vSql = "SELECT * FROM usuario
					where Tipo=5;";

			//Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL($vSql);

			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}
	public function allVendedores($idShopRental)
	{
		try {
			//Consulta sql
			$vSql = "SELECT * FROM usuario
					where Tipo=4;";

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

			$vSql = "SELECT * from usuario where UserName='$objeto->UserName'";

			//Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL($vSql);
			if (is_object($vResultado[0])) {
				$user = $vResultado[0];
				if (password_verify($objeto->Password, $user->Password)) {
					$usuario = $this->get($user->id);
					if (!empty($usuario)) {
						// Datos para el token JWT
						$data = [
							'id' => $usuario->idUsuario,
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
			if (isset($objeto->password) && $objeto->password != null) {
				$crypt = password_hash($objeto->password, PASSWORD_BCRYPT);
				$objeto->password = $crypt;
			}
			//Consulta sql            
			$vSql = "Insert into user (name,email,password,rol_id)" .
				" Values ('$objeto->name','$objeto->email','$objeto->password',$objeto->rol_id)";

			//Ejecutar la consulta
			$vResultado = $this->enlace->executeSQL_DML_last($vSql);
			// Retornar el objeto creado
			return $this->get($vResultado);
		} catch (Exception $e) {
			handleException($e);
		}
	}
}
