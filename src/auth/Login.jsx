import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const sendUser = () => {
    if (isPasswordMacth()) {
      const user = {
        name: name,
        surname: surname,
        email: email,
        password: password,
      };
      try {
        axios
          .post(addUserUrl, user)
          .then((response) => {
            console.log("user added");
            alert("user added");
            setName(null);
            setSurname(null);
            setEmail(null);
            setPassword(null);
            setRePassword(null);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        alert("Error adding user");
      }
    } else {
      alert("password match not!! ");
    }
  };

  const isPasswordMacth = () => {
    return password === repassword;
  };

  return (
    <div>
      <div className="form">
        <h1>Login</h1>
        <form id="login" name="login" className="adduser">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="button" onClick={sendUser}>
            Login
          </button>
          <p style={{ color: "black" }}> if you have not an account please </p>
          <a href="">
            <NavLink to="/signin">sign in</NavLink>
          </a>
        </form>
      </div>
    </div>
  );
}

export default Login;
