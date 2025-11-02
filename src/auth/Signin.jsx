import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function Signin() {
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [repassword, setRePassword] = useState(null);
  const addUserUrl = "http://localhost:3000/api/users/adduser/";

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
        <h1>Sign in</h1>
        <form id="adduser" name="adduser" className="adduser">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            id="surname"
            name="surname"
            placeholder="surname"
            value={surname || ""}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
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
          <input
            type="password"
            id="passwordagain"
            name="passwordagain"
            placeholder="password again"
            value={repassword || ""}
            onChange={(e) => setRePassword(e.target.value)}
            required
          />
          <button type="button" onClick={sendUser}>
            Sign in
          </button>
          <p style={{ color: "black" }}> if you have an account please </p>
          <a href="">
            <NavLink to="/login">log in</NavLink>
          </a>
        </form>
      </div>
    </div>
  );
}

export default Signin;
