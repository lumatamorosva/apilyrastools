import { useContext, useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export function Auth({requiredRoles}) {
  const rolesArray = Array.isArray(requiredRoles)? requiredRoles:[requiredRoles];
  const location = useLocation();
  const { user, decodeToken } = useContext(UserContext);
  //Obtener usuario
  const [userData,setUserData]=useState(decodeToken()); 
  useEffect(()=>{setUserData(decodeToken())},[user]);
  let render = null;
  console.log("Estos son los datos:", requiredRoles, " and ", userData.rol);
  // Especificar el render si el usuario esta autorizado
  if (userData && rolesArray.includes(userData.rol)) {
    render = <Outlet />;
  } else {
    render = <Navigate to="/unauthorized" state={{ from: location }} />;
  }
  return <div>{render}</div>;
}
