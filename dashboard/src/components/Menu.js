import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";

const FRONTEND_HOME = process.env.REACT_APP_FRONTEND_HOME || "http://localhost:3000";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user } = useUserData();
  const username = user?.username || "USER";
  const initials = username.slice(0, 2).toUpperCase();

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };
  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };
  const menuClass = 'menu';
  const activeMenuClass = 'menu-selected';
  return (
    <div className="menu-container">
      <img src="logo.png" alt="Zerodha" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link style={{textDecoration:"none"}} to="/" onClick={() => handleMenuClick(0)}>
            <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link style={{textDecoration:"none"}} to="/orders" onClick={() => handleMenuClick(1)}>
            <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>Orders</p>
            </Link>
          </li>
          <li>
            <Link style={{textDecoration:"none"}} to="/holdings" onClick={() => handleMenuClick(2)}>
            <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>Holdings</p>
            </Link>
          </li>
          <li>
            <Link style={{textDecoration:"none"}} to="/positions" onClick={() => handleMenuClick(3)}>
            <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>Positions</p>
            </Link>
          </li>
          <li>
            <Link style={{textDecoration:"none"}} to="/funds" onClick={() => handleMenuClick(4)}>
            <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>Funds</p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick} style={{position: 'relative', cursor: 'pointer'}}>
          <div className="avatar">{initials}</div>
          <p className="username">{username}</p>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown" style={{position: 'absolute', right: 0, top: '110%', background: '#fff', boxShadow: '0 6px 12px rgba(0,0,0,0.08)', borderRadius: 6, padding: '0.5rem', zIndex: 50}}>
              <Link to="/" style={{display: 'block', padding: '0.5rem 1rem', color: '#333', textDecoration: 'none'}}>Profile</Link>
              <a href={FRONTEND_HOME} style={{display: 'block', padding: '0.5rem 1rem', color: '#333', textDecoration: 'none'}}>Logout</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
