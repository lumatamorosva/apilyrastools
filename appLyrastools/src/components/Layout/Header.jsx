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
import Tooltip from "@mui/material/Tooltip";
import { useCart } from "../../hooks/useCart";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from 'react-i18next';

export default function Header() {
  //Para la traducción
  const { t } = useTranslation();
  //Obtener usuario
  const {user, decodeToken}= useContext(UserContext)
  const [userData,setUserData]=useState(decodeToken())
  useEffect(()=>{setUserData(decodeToken())},[user]);
  console.log("Usuario en Header: " , userData);
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
  //Cerrado menu opciones
  const handleOpcionesMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  //Lista enlaces menu usuario
  const userItems = [
    { name: t('nav.login'), link: "/user/login", login: false },
    { name: t('nav.register'), link: "/user/create", login: false },
    { name: t('nav.pass'), link: "/user/change", login: true },
    { name: t('nav.logout'), link: "/user/logout", login: true },
  ];
  //Lista enlaces menu principal
  const navItems = [
    {name: t('nav.op1'), link: "/catalog-productos/", roles:null },
    {name: t('nav.op2'), link: "/Paginas/ListPromociones/", roles:null },
    {name: t('nav.op3'), link: "/Paginas/Reviews/", roles:null },
    {name: t('nav.op7'), link: "/Paginas/PedidosList/", roles:[1,5] },
    {name: t('nav.op8'), link: "/Paginas/Dashboard/", roles:[1] },
    {name: t('nav.op4'), link: "/product-table/", roles:[1] },
  ];
  //Identificador menu principal
  const menuIdPrincipal = "menu-appbar";
  //Menu En la barra de nav(Revisado)
  const menuPrincipal = (
    <Box sx={{ display: { xs: "none",sm: "none", md: "block" } }}>
      {navItems && navItems.map((item, index) => {
        const isPublic = item.roles === null;
        //console.log(`Leer aquí item.roles:`, item.roles);
        const isAuthorized = item.roles && item.roles.includes(parseInt(userData?.rol));
          if (isPublic || isAuthorized) {
            return (
              <Button key={index} component={Link} to={item.link} color="white">
                <Typography textAlign="center">{item.name}</Typography>
              </Button>
            );
          }return null;
          })}
    </Box>
  );
  //Menu Hamburguesa (Revisado)
const menuPrincipalMobile = navItems
  .filter(page => page.roles === null || page.roles.includes(parseInt(userData?.rol)))
  .map((page, index) => (
    <MenuItem key={index} component={Link} to={page.link} onClick={handleClosePrincipalMenu}>
      <Typography sx={{ textAlign: "center", color: (theme) => theme.palette.getContrastText }}>
        {page.name}
      </Typography>
    </MenuItem>
));
  //Identificador menu usuario
  const userMenuId = "user-menu";
  //Menu Usuario
  const userMenu = (
    <Box sx={{ display: 'flex'}}>
      <IconButton
        sx={{ marginLeft: 'auto' }}
        size="large"
        aria-label="account of current user"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
        ><AccountCircle sx={{color:(theme) => theme.palette.common.white}}/>
      </IconButton>

      <Menu
        sx={{ mt: "45px" }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: "top", horizontal: "right", }}
        keepMounted transformOrigin={{ vertical: "top", horizontal: "right", }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        {userData &&(
          <MenuItem onClick={handleUserMenuClose}>
            <Typography variant="subtitle1" gutterBottom>{userData?.userName} </Typography>
          </MenuItem>
       )}

        {userItems.map((setting, index) =>  {
          //Verificar las opciones del usuario 
          if(setting.login && userData && Object.keys(userData).length >0){
            return (<MenuItem key={index} component={Link} to={setting.link} onClick={handleUserMenuClose}>
              <Typography sx={{ textAlign: 'center' }} >
                {setting.name}
              </Typography>
            </MenuItem>)
          }else if(!setting.login && Object.keys(userData).length==0){
            return (<MenuItem key={index} component={Link} to={setting.link} onClick={handleUserMenuClose}>
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
          <Badge badgeContent={getCountItems(cart)} color="primary" component={Link} to="/rental/crear/" > <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </MenuItem>
    </Menu>
  );
  return (
    <Box sx={{ flexGrow: 1, '@media print': { display: 'none' } }}>
      <AppBar
        position="static"
        color="primaryLight"
        sx={{ backgroundColor: "primaryLight.main" }}
      >
        <Toolbar sx={{display: 'flex',alignItems: "center",justifyContent: "space-between",
          backgroundColor: (theme) => theme.palette.secondary.main, color:(theme) => theme.palette.common.white}}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton 
                aria-controls={menuIdPrincipal}
                aria-haspopup="true"
                sx={{ mr: 2, color:(theme) => theme.palette.common.white}}
                onClick={handleOpenPrincipalMenu}>
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
                <IconButton sx={{mr: "30px"}}component="a"href="/"> <HandymanIcon sx={{mr:"10px"}} />{t('nav.title')}</IconButton>
              </Tooltip>
              {/* Opciones del Menú */}
              {menuPrincipal}
          </Box>
          {/* Espacio entre los íconos y el resto de elementos */}
          <Box sx={{ flexGrow: 20 }} />
          {/* Iconos */}
          <Box sx={{ display: 'flex', alignItems: "center", gap: 1 }} />
            <Box sx={{ display: { xs: "flex", md: "flex" } }}>
              {userData && (userData.rol == 1 || userData.rol == 5) && (<IconButton >
                <Badge badgeContent={getCountItems(cart)}color="primary"component={Link}to="/rental/crear/"
                  ><ShoppingCartIcon sx={{color:(theme) => theme.palette.common.white}}/>
                </Badge>
              </IconButton>)}
            </Box>
          <div>{userMenu}</div>
        </Toolbar>
      </AppBar>
      {menuOpcionesMobile}
    </Box>
  );
}
