import React, {useEffect, useLayoutEffect, useState} from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import {Route, Routes, useLocation} from "react-router-dom";
import SignUp from "../../pages/SignUp/SignUp";
import Login from "../../pages/Login/Login";
import ForgetPassword from "../../pages/ForgetPassword/ForgetPassword";
import "./style.css";
import cx from "classnames";
import {AnimatePresence, motion} from "framer-motion";
import {Toaster} from "react-hot-toast";
import useAdminMe from "../../CustomHooks/useAdminMe";
import ResetPassword from "../../pages/ResetPassword/ResetPassword";
import CheckCode from "../../pages/checkCode/checkCode";
const DefaultLayout = ({children}) => {
  const location = useLocation();

  const [showSide, setShowSide] = useState(false);

  useLayoutEffect(() => {
    handleGetAdminData();
  }, []);

  const {handleGetAdminData, adminData, setAdminData, loading, originalFaqs} =
    useAdminMe();

  useLayoutEffect(() => {
      console.log(adminData)
  }, [adminData]);

  return loading ? "loading..." : (

    <>
      <Toaster
        position='top-right'
        reverseOrder={false}
        containerClassName='z_index'
      />
      { !adminData ? (
        <Routes>
          {/* <Route path='/signup' element={<SignUp />} /> */}
          <Route path='/login' element={<Login />} />
          <Route path='/*' element={<Login />} />
          <Route path='/reset_password' element={<ResetPassword />} />
          <Route path='/forgetPassword' element={<ForgetPassword />} />
          <Route path='/chekc_code' element={<CheckCode />} />
        </Routes>
      ) : (
        <>
          <div className='main_layout '>
            <AnimatePresence>
              {showSide && (
                <motion.div
                  className='sidebar_content '
                  initial={{x: "-100%"}}
                  animate={{x: 0}}
                  exit={{x: "-100%"}}
                >
                  <Sidebar showSide={showSide} setShowSide={setShowSide} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className={cx("body_content", {open: showSide})}
              style={{backgroundColor: "#f8f9fc"}}
            >
              <Navbar showSide={showSide} setShowSide={setShowSide} />
              {children}
              <Footer />
            </motion.div>
          </div>
        </>
      )}
    </>
  );
};

export default DefaultLayout;
