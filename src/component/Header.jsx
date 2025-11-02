import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Header() {
  const [userId, setUserId] = useState(null);
  return (
    <div className="maincontainer">
      <NavLink to="/signin">Signin</NavLink>
      <NavLink to="/login">Login</NavLink>
    </div>
  );
}

export default Header;
