import AgreementPage from "../pages/Agreement/AgreementPage";
import DNI_page from "../pages/DNI_page/DNI_page";
import Envato from "../pages/EnvatoPage/Envato";
import Mascota from "../pages/Mascota/Mascota";
import SearchPage from "../pages/SearchPage/SearchPage";
import SignUp from "../pages/SignUp/SignUp";
import Race from "./../pages/Race/Race";
import Services from "./../pages/Services/Services";
import Users from "./../pages/Users/Users";
import Account from "./../pages/Account/Account";
import Calfication from "../pages/Calfication/Calfication";
import PeopleFindPets from "./../pages/PeopleFindPets/PeopleFindPets";
import Benefits from "../pages/Benefits/Benefits";
import ServicesDash from "../pages/ServicesDash/ServicesDash";
import Departamento from "./../pages/Departamento/Departamento";
import AddAnimal from "../pages/AddAnimal/AddAnimal";
// import Test from "../pages/Test/Test";
import Order from "./../pages/Order/Order";
import DeliveryMan from "./../pages/DeliveryMan/DeliveryMan";
import { Products } from "./../pages/Products/Products";
import HomePage from "../pages/HomePage/HomePage";
import AnimalType from './../pages/AnimalType/AnimalType';
import Provincia from './../pages/Provinicia/Provinicia';
import Distrito from './../pages/Distrito/Distrito';
import About_us from "../pages/About_us/About_us";
import Brands from '../pages/Brands/Brands'
import HomeFeatures from "../pages/HomeFeatures/HomeFeatures";
import Testimonials from './../pages/Testimonials/Testimonials';
import FAQs from "../components/pages/FAQs/FAQs";
import Admins from "../components/pages/adminns/Admins";
const routesData = [
  {
    name: "",
    pathname: "",
  },
];

export const allRoutes = [
  {
    name: "Account",
    pathname: "/account",
    component: <Account />,
  },
  {
    name: "Mascotas",
    pathname: "/pets",
    component: <Mascota />,
  },
  {
    name: "Busqueda",
    pathname: "/search",
    component: <SearchPage />,
  },
  {
    name: "Raza",
    pathname: "/raza",
    component: <Race />,
  },

  {
    name: "PeopleFindPets",
    pathname: "/people_find_pets",
    component: <PeopleFindPets />,
  },
  {
    name: "Benefits",
    pathname: "/benefits",
    component: <Benefits />,
  },
  {
    name: "Calfication",
    pathname: "/calfication",
    component: <Calfication />,
  },
  {
    name: "Convenios",
    pathname: "/agreemetns",
    component: <AgreementPage />,
  },

  {
    name: "Department",
    pathname: "/departmento",
    component: <Departamento />,
  },
  {
    name: "Brands",
    pathname: "/brands",
    component: <Brands />,
  },
  {
    name: "Add Animal",
    pathname: "/add_animal",
    component: <AddAnimal />,
  },
  {
    name: "DNI",
    pathname: "/dni",
    component: <DNI_page />,
  },
  // {
    // name: "Solicitudes y Servicios",
    // pathname: "/req_serv",
    // component: <Services />,
  // },

  {
    name: "Evento",
    pathname: "/evento",
    component: <Envato />,
  },
  {
    name: "Home",
    pathname: "/home",
    component: <HomePage />,
  },
  {
    name: "Services",
    pathname: "/services",
    component: <ServicesDash />,
  },
  {
    name: "Order",
    pathname: "/order",
    component: <Order />,
  },
  {
    name: "Deliveryman",
    pathname: "/deliveryman",
    component: <DeliveryMan />,
  },
  {
    name: "Products",
    pathname: "/products",
    component: <Products />,
  },
  {
    name: "Usuarios",
    pathname: "/users",
    component: <Users />,
  },
  {
    name: "AnimalType",
    pathname: "/animal_type",
    component: <AnimalType />,
  },
  {
    name: "Provincia",
    pathname: "/provincia/:dep_id",
    component: <Provincia />,
  },
  {
    name: "Distrito",
    pathname: "/distrito/:prov_id",
    component: <Distrito />,
  },

  {
    name: "Distrito",
    pathname: "/distrito/:prov_id",
    component: <Distrito />,
  },
  {
    name: "About us",
    pathname: "/about-us",
    component: <About_us/>,
  },
{
  name: "Mascotas",
  pathname: "/home-features",
  component: <HomeFeatures />,
},
{
  name: "testimonios",
  pathname: "/testimonials",
  component: <Testimonials />,
},
{
  name: "faqs",
  pathname: "/faqs",
  component: <FAQs />,
},
{
  name: "admins",
  pathname: "/admins",
  component: <Admins />,
},

];

export const mascotaOptions = [
  {
    name: "Mascotas",
    pathname: "/pets",
    component: <Mascota />,
  },

  // {
  //   name: "Busqueda",
  //   pathname: "/search",
  //   component: <SearchPage />,
  // },
  {
    name: "Raza",
    pathname: "/raza",
    component: <Race />,
  },
  {
    name: "Convenios",
    pathname: "/agreemetns",
    component: <AgreementPage />,
  },
  {
    name: "DNI",
    pathname: "/dni",
    component: <DNI_page />,
  },
  {
    name: "Solicitudes y Servicios",
    pathname: "/req_serv",
    component: <Services />,
  },

  {
    name: "Evento",
    pathname: "/evento",
    component: <Envato />,
  },
];
