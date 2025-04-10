import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/layout/SideBar";
import Header from "./components/layout/Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div
          className={`ml-20 ${
            !collapsed ? "lg:ml-64" : ""
          } w-full transition-all duration-300`}
        >
          <Header />
          <main className="container mx-auto px-4 py-4">{children}</main>
        </div>
      </div>
    </Router>
  );
};

export default Layout;
