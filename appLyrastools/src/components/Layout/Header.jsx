import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HandymanIcon from '@mui/icons-material/Handyman';
import MoreIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import { useCart } from "../../hooks/useCart";
import { UserContext } from "../../context/UserContext";

export default function Header() {
  //Obtener usuario
  const {user, decodeToken,autorize}= useContext(UserContext)
  const [userData,setUserData]=useState(decodeToken())
  useEffect(()=>{setUserData(decodeToken())},[user])
  //Cantidad de elementos en el carrito
  const {cart, getCountItems}=useCart()
  //Gestión menu usuario
  const [anchorElUser, setAnchorEl] = useState(null);
  //Gestión menu opciones
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = useState(null);
  //Booleano Menu opciones responsivo
  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);
  //Gestión menu principal
  const [anchorElPrincipal, setAnchorElPrincipal] = useState(null);
  //Abierto menu usuario
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //Cerrado menu usuario
  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };
  //Abierto menu principal
  const handleOpenPrincipalMenu = (event) => {
    setAnchorElPrincipal(event.currentTarget);
  };
  //Cerrado menu principal
  const handleClosePrincipalMenu = () => {
    setAnchorElPrincipal(null);
  };
  //Abierto menu opciones
  const handleOpcionesMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  //Cerrado menu opciones
  const handleOpcionesMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  //Lista enlaces menu usuario
  const userItems = [
    { name: "Login", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Logout", link: "/user/logout", login: true },
  ];
  //Lista enlaces menu principal
  const navItems = [
    { name: "Comprar Herramientas", link: "/catalog-productos/", roles:null },
    //Rol desactivado por el momento
    { name: "Mantenimiento Productos", link: "/product-table/", roles:['Administrador'] },
  ];
  //Identificador menu principal
  const menuIdPrincipal = "menu-appbar";
  //Menu En la barra de nav(Eliminar?)
  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {navItems && navItems.map((item, index) => {
          //if(autorize(requiredRoles:['Administrador']))
        if(userData && item.roles){
          //Verificar rol
          if(autorize({requiredRoles:item.roles})){
            //Rutas con restricción
            return (<Button key={index} component={Link} to={item.link} color="white" >
              <Typography textAlign="center">{item.name}</Typography>
            </Button>)
          }
        }else{
          if(item.roles==null){
            //Rutas sin restricción
            return (<Button key={index} component={Link} to={item.link} color="white" >
              <Typography textAlign="center">{item.name}</Typography>
            </Button>)
          }
        }   
      })}
    </Box>
  );
  //Menu Hamburguesa (Revisado)
  const menuPrincipalMobile = navItems.map((page, index) => (
    <MenuItem key={index} component={Link} to={page.link}>
      <Typography sx={{ textAlign: "center", color:(theme) => theme.palette.getContrastText }}>{page.name}</Typography>
    </MenuItem>
  ));
  //Identificador menu usuario
  const userMenuId = "user-menu";
  //Menu Usuario
  const userMenu = (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <AccountCircle sx={{color:(theme) => theme.palette.common.white}}/>
      </IconButton>

      <Menu
        sx={{ mt: "45px" }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: "top", horizontal: "right", }}
        keepMounted transformOrigin={{ vertical: "top", horizontal: "right", }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        {userData &&(
          <MenuItem>
            <Typography variant="subtitle1" gutterBottom>
              {userData?.email}
            </Typography>
          </MenuItem>
       )}

        {userItems.map((setting, index) =>  {
          //Verificar las opciones del usuario 
          if(setting.login && userData && Object.keys(userData).length >0){
            return (<MenuItem key={index} component={Link} to={setting.link}>
              <Typography sx={{ textAlign: 'center' }}>
                {setting.name}
              </Typography>
            </MenuItem>)
          }else if(!setting.login && Object.keys(userData).length==0){
            return (<MenuItem key={index} component={Link} to={setting.link}>
              <Typography sx={{ textAlign: 'center' }}>
                {setting.name}
              </Typography>
            </MenuItem>)
          }          
        })}
      </Menu>
    </Box>
  );
  //Identificador menu opciones
  const menuOpcionesId = "badge-menu";
  //Menu opciones responsivo
  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuOpcionesId}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge
            badgeContent={getCountItems(cart)}
            color="primary"
            component={Link}
            to="/rental/crear/"
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Compras</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="primaryLight"
        sx={{ backgroundColor: "primaryLight.main" }}
      >
        <Toolbar sx={{backgroundColor: (theme) => theme.palette.secondary.main, color:(theme) => theme.palette.common.white}}>
          <IconButton 
            aria-controls={menuIdPrincipal}
            aria-haspopup="true"
            sx={{ mr: 2, color:(theme) => theme.palette.common.white}}
            onClick={handleOpenPrincipalMenu}
          >
            <MenuIcon/>
          </IconButton>
          <Menu
            id={menuIdPrincipal}
            anchorEl={anchorElPrincipal}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElPrincipal)}
            onClose={handleClosePrincipalMenu}
            sx={{ display: "block"}}
          >
            {menuPrincipalMobile}
          </Menu>
          {/* Enlace página inicio */}
          <Tooltip title="Home">
            <IconButton sx={{mr: "30px"}}
              component="a"
              href="/"
            > <HandymanIcon sx={{mr:"10px"}} />PRINCIPAL
            </IconButton>
          </Tooltip>
          {/* Enlace página inicio */}
          {menuPrincipal}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "flex", md: "flex" } }}>
            <IconButton >
              <Badge
                badgeContent={getCountItems(cart)}
                color="primary"
                component={Link}
                to="/rental/crear/"
              >
                <ShoppingCartIcon sx={{color:(theme) => theme.palette.common.white}}/>
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={1} sx={{color:(theme) => theme.palette.common.white}}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
          <div>{userMenu}</div>
          <Box sx={{ display: { xs: "flex", md: "flex" } }}>
            <IconButton 
              size="large"
              aria-label="show more"
              aria-controls={menuOpcionesId}
              aria-haspopup="true"
              onClick={handleOpcionesMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, mx: 2 }}>
        </Box>
        </Toolbar>
      </AppBar>
      {menuOpcionesMobile}
    </Box>
  );
}
