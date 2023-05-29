import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./wb.less";

const Wb = () => {
  return (
    <>
      <div className="wb-layout">
        <Outlet />
      </div>
    </>
  );
};

export default Wb;
