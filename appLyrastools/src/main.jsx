import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { RouterProvider } from "react-router";
import { PageNotFound } from "./components/Home/PageNotFound";
import { ListMovies } from "./components/Paginas/ListMovies";
import TableProducts from "./components/Paginas/TableProductos";
import ListPromociones from "./components/Paginas/ListPromociones";
import { CreateProducto } from "./components/Paginas/CreateProducto";
import { CreatePromocion } from "./components/Paginas/CreatePromocion";
import { UpdateMovie } from "./components/Paginas/UpdateMovie";
import { CatalogProductos } from "./components/Paginas/CatalogProductos";
import { UploadImagenParaProducto } from "./components/Paginas/UploadImage";
import { CreateMovieRental } from "./components/Rental/PaginaCarritoCheckout";
import { GraphRetal } from "./components/Rental/GraphRental";
import UserProvider from "./components/User/UserProvider";
import { Unauthorized } from "./components/User/Unauthorized";
import { Login } from "./components/User/Login";
import { Logout } from "./components/User/Logout";
import { Signup } from "./components/User/Signup";
import {CartProvider} from "./context/CartContext"
const rutas=createBrowserRouter(
  [
    {
      element: <App />,
      children:[
        {
          path:'/',
          element: <Home />
        },
        {
          path: '*',
          element: <PageNotFound />
        },
        //Grupos de rutas a autorizar
        //Grupo 1: Administrador
        //Grupo 2: Cliente
        //Grupo 3: Administrador y el Cliente
        {
          //Grupo 1
          path:'/',
          //element: <Auth requiredRoles={['Cliente']} />,
          children:[
            {
              path:'/product-table',
              element: <TableProducts />
            },
            {
              path:'/Paginas/crear/',
              element: <CreateProducto />
            },
            {
              path:'/Paginas/crearPromocion/',
              element: <CreatePromocion />
            },
            {
              path:'/Paginas/ListPromociones/',
              element: <ListPromociones />
            },
            {
              path:'/movie/update/:id',
              element: <UpdateMovie />
            },
          ]
        },
        {
          path:'/movie/',
          element: <ListMovies />
        },
        {
          path: '/catalog-productos/',
          element: <CatalogProductos />,
        },
        {
          path: 'movie/image/',
          element: <UploadImagenParaProducto />
        },
        {
          path: '/rental/crear/',
          element: <CreateMovieRental />,
        },
        {
          path: '/rental/graph',
          element: <GraphRetal />,
        },
        {
          path: '/unauthorized',
          element: <Unauthorized />
        },
        {
          path: '/user/login',
          element: <Login />
        },
        {
          path:'/user/logout',
          element: <Logout />
        },
        {
          path: '/user/create',
          element: <Signup />
        }
      ]
    }
  ]
)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/*Se rodea el app con el carrito*/} 
    <CartProvider>
      {/*Se rodea el app con el control de usuario*/}
      <UserProvider>
        <RouterProvider router={rutas} /> 
      </UserProvider>
  </CartProvider>
</StrictMode>, 
);
