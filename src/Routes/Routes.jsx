import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Layout";
import { allRoutes, mascotaOptions } from "./RoutesData";
import SearchPage from "../pages/SearchPage/SearchPage";
import SignUp from "../pages/SignUp/SignUp";
import Login from "../pages/Login/Login";

const RoutesData = () => {
  return (
    <>
      <Routes>
        {allRoutes?.map((item, index) => {
          return (
            <Route path={item.pathname} element={item.component} key={index} />
          );
        })}
        <Route path="*" element={<SearchPage />} />
      </Routes>
    </>
  );
};

export default RoutesData;
