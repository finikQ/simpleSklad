import React from "react";
import "./navigation.less";
import { NavLink } from "react-router-dom";
import logo from './../../../assets/logo.svg';

const Navigation = () => {
  return (
    <>
      <nav>
        <ul className="parent-menu">
          <div className="div-logo"><img className="logo" src={logo} alt="Logo" /></div>
          <li><NavLink to="/">Main</NavLink></li>
          <li><NavLink to="wb/fbs">WildBerries</NavLink>
            <ul>
              <li><NavLink to="wb/fbs">FBS</NavLink></li>
              <li><NavLink to="#">FBO</NavLink></li>
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;