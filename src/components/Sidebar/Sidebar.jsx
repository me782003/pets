// import { FaChevronLeft, FaChevronRight, FaCircleUser, FaPaw, FaUser } from 'react-icons/fa6';
// import logoImg from '../../assets/images/worldpetsperu_logo.png';
// import './style.css';
// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import DropDownList from '../DropDownList/DropDownList';
// import { mascotaOptions, userOptions } from '../../utils/dropdowndata';

// export default function Sidebar() {
//   const [openMascotaMenu , setOpenMascotaMenu] = useState(false);
//   const [openUserMenu , setOpenUserMenu] = useState(false);

//   function handleOpenMascotaMenu() {
//     if(openUserMenu) {
//       setOpenMascotaMenu(false);
//     }
//     setOpenMascotaMenu(prevState => !prevState);
//   }

//   function handleOpenUserMenu() {
//     if(openMascotaMenu) {
//       setOpenUserMenu(false);
//     }
//     setOpenUserMenu(prevState => !prevState);
//   }

//   return (
//     <aside className='sidebar'>
//        <img src={logoImg} alt='logo'/>
//        <ul>
//         <li className='sidebar-user'>
//             <FaCircleUser />
//             <Link to="/account">Mi cuenta</Link>
//         </li>

//         <div className='sidebar-items-container'>
//         <li className='sidebar-item' onClick={handleOpenMascotaMenu}>
//             <div>
//                <FaPaw />
//                 <span>Mascota</span>
//             </div>
//             <FaChevronRight className={`sidebar-arrow ${openMascotaMenu && 'rotate'}`}/>
//             {openMascotaMenu && !openUserMenu && <DropDownList list={mascotaOptions} />}
//         </li>

//         <li onClick={handleOpenUserMenu} className={`sidebar-item sidebar-last-item ${openMascotaMenu && 'open-mascota'}`}>
//             <div>
//                 <FaUser />
//                 <span>Usuarios</span>
//             </div>
//             <FaChevronRight className={`sidebar-arrow  ${openMascotaMenu && 'rotate'}`}/>

//             {openUserMenu && !openMascotaMenu &&<DropDownList list={userOptions}/>}
//         </li>
//         </div>
//        </ul>

//        <div className='sidebar-chevron-left-box'>
//        <FaChevronLeft />
//        </div>
//     </aside>
//   )
// }

import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import "./style.css";
import logoImg from "../../assets/images/worldpetsperu_logo.png";
import {FaChevronLeft, FaChevronRight, FaCircleUser, FaPaw, FaUser} from "react-icons/fa6";
import {Link} from "react-router-dom";
import CustomSubmenuLabel from "../CustomSubmenuLabel/CustomSubmenuLabel";
import { Home, OutDoor } from "../../assets/svgIcons";
import { motion } from 'framer-motion';
// import Brands from './c'
import { Window } from './../../assets/svgIcons/index';

export default function SidebarComponent({showSide  , setShowSide}) {




  return (
    <motion.div initial={{x:"-100%"}} animate={{x:0}} exit={{x:"-100%"}} className="sidebar">
      {/* <div className="open_icon  close-icon"><FaChevronRight /></div> */}

    <Sidebar

      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          background: "transparent",
          height: "100vh",
          padding: "10px 20px",
        },
      }}
      className='custom-sidebar'
    >
      <a href='https://worldpetsperu.com/' target='_blank'>
        <img src={logoImg} />
      </a>

      <Menu>
        <MenuItem
          component={<Link to='/account' />}
          className='menu_item sidebar-user'
        >
          {" "}
          <FaCircleUser /> <span>Mi cuenta</span>
        </MenuItem>

        <SubMenu
          label={<CustomSubmenuLabel iconName={<FaPaw />} text='Mascota' />}
          className='sub-menu'
        >
          <h4>OPCIONES MASCOTAS:</h4>
          <MenuItem className='menu_item' component={<Link to='/pets' />}>
            Mascotas
          </MenuItem>
          <MenuItem className='menu_item' component={<Link to='/animal_type' />}>
          Tipos de Animales
          </MenuItem>
          <MenuItem className='menu_item' component={<Link to='/search' />}>
            Busqueda
          </MenuItem>
          <MenuItem className='menu_item' component={<Link to='/raza' />}>
            Raza
          </MenuItem>

          <MenuItem
            className='menu_item'
            component={<Link to='/departmento' />}
          >
            Departamento
          </MenuItem>
          <MenuItem
            className="menu_item"
            component={<Link to="/brands" />}
          >
            brands
          </MenuItem>

          <MenuItem className='menu_item' component={<Link to='/add_animal' />}>
            Agregar Animal
          </MenuItem>
          <MenuItem className='menu_item' component={<Link to='/agreemetns' />}>
            Convenios
          </MenuItem>
          <MenuItem className='menu_item' component={<Link to='/dni' />}>
            DNI
          </MenuItem>
          {/* <MenuItem className="menu_item" component={<Link to="/req_serv" />}> */}
          {/* Solicitudes y Servicios */}
          {/* </MenuItem> */}
          <MenuItem className='menu_item' component={<Link to='/evento' />}>
            Evento
          </MenuItem>
          <MenuItem className='menu_item' component={<Link to='/order' />}>
            Orden
          </MenuItem>
          <MenuItem
            className='menu_item'
            component={<Link to='/deliveryman' />}
          >
            Repartidor
          </MenuItem>
          <MenuItem className='menu_item' component={<Link to='/products' />}>
            Productos
          </MenuItem>
          <MenuItem
            className='menu_item'
            component={<Link to='/calfication' />}
          >
            Calcificación
          </MenuItem>
          <MenuItem
            className='menu_item'
            component={<Link to='/people_find_pets' />}
          >
            La gente encuentra mascotas{" "}
          </MenuItem>
        </SubMenu>
        

        <SubMenu
          label={<CustomSubmenuLabel iconName={<FaUser />} text='Usuarios' />}
          className='sub-menu last-submenu'
        >
          <h4>OPCIONES USUARIOS:</h4>
          <MenuItem className='menu_item' component={<Link to='/users' />}>
            Usuarios
          </MenuItem>
          <MenuItem className='menu_item' component={<Link to='/admins' />}>
          administradores
          </MenuItem>
        </SubMenu>

      
        <MenuItem
          className='menu_item_single'
          component={<Link to='/home' />}
        >
          Página de inicio
        </MenuItem>
        <MenuItem
          className='menu_item_single'
          component={<Link to='/home-features'/>}
        >
          Características
        </MenuItem>
        <MenuItem
          className='menu_item_single'
          component={<Link to='/testimonials'/>}
        >
          Testimonios
        </MenuItem>
        <MenuItem
          className='menu_item_single'
          component={<Link to='/about-us'/>}
        >
          Sobre nosotras
        </MenuItem>
        <MenuItem
          className='menu_item_single'
          component={<Link to='/benefits' />}
        >
          Beneficios
        </MenuItem>
        <MenuItem
          className='menu_item_single'
          component={<Link to='/services' />}
        >
          Services
        </MenuItem>
        <MenuItem
          className='menu_item_single'
          component={<Link to='/faqs'/>}
        >
          Preguntas frecuentes
        </MenuItem>
        <MenuItem
          className='menu_item_single '
          onClick={()=> {
            localStorage.removeItem('pits-token');
            window.location.reload();
          }}
          
        >
           {OutDoor} cerrar sesión
        </MenuItem>
      </Menu>

      <div className='close-icon' onClick={()=> setShowSide(false)}>
        <FaChevronLeft />
      </div>
    </Sidebar>

    </motion.div>

  );
}
