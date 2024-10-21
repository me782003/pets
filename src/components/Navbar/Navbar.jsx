import {
  FaCartShopping,
  FaChevronRight,
  FaCircleUser,
  FaList,
  FaListUl,
} from "react-icons/fa6";
import userImg from "../../assets/images/avatarUser.png";
import "./style.css";
import {Menu, OutDoor} from "../../assets/svgIcons";
import {MenuFoldOutlined} from "@ant-design/icons";
import {AnimatePresence} from "framer-motion";
import {motion} from "framer-motion";
import useAdminMe from "../../CustomHooks/useAdminMe";
import {useEffect, useLayoutEffect} from "react";
import {Dropdown} from "antd";
import { useNavigate } from "react-router-dom";

export default function Navbar({showSide, setShowSide , logoutModal  , setLogoutModal}) {
  const {handleGetAdminData, adminData, setAdminData, loading, originalFaqs} =
    useAdminMe();
  useEffect(() => {
    handleGetAdminData();
  }, []);

  useLayoutEffect(() => {
    console.log(adminData);
  }, [adminData]);

  const navigate = useNavigate()

  const items = [
    {
      key: "1",
      label: <div onClick={()=> navigate("/account")}><FaCircleUser /> Mi cuenta</div>,
    },
    {
      key: "2",
      label: (
        <div
          className='text-danger'
          onClick={() => {
            setLogoutModal(true) 
          }}
        >
          {OutDoor} Cerrar sesión
        </div>
      ),
    },
  ];

  return (
    <header className='navbar '>
      <AnimatePresence>
        {!showSide && (
          <motion.div
            whileHover={{scale: 1.1}}
            initial={{x: "-100%"}}
            animate={{x: 0}}
            exit={{x: "-100vw"}}
            className=' open_sidebar fs-4 pointer'
            onClick={() => setShowSide(true)}
          >
            <FaChevronRight />
          </motion.div>
        )}
      </AnimatePresence>

      <div className='header-data'>
        {/* <div className='profile_cart'>
             <FaCartShopping />
             <span>0</span>
         </div> */}

        <Dropdown menu={{items}} placement='bottom'>
          <div style={{cursor:"pointer"}}  className='profile_data'>
            <p className='m-0'>{adminData?.name}</p>
            <img src={adminData?.admin_image} />
          </div>
          {/* <Button>bottom</Button> */}
        </Dropdown>
      </div>
    </header>
  );
}
