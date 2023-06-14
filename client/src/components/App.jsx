import React from "react";
import "./app.less";
import { Outlet } from "react-router-dom";
import Header from "./header/Header.jsx";

const App = () => {
  return (
    <div className="layout">
      <Header />
      <div className="app-layout">
        <div className="app-component">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
