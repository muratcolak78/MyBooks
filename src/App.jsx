import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Signin from "./auth/Signin";
import Login from "./auth/Login";
import Home from "./component/Home";
import BookDetails from "./component/BookDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="header">My Books</header>

        <aside className="sidebar">
          <NavLink to="/" className="nav">
            Home
          </NavLink>
          <NavLink to="/signin" className="nav">
            Sign Up
          </NavLink>
          <NavLink to="/login" className="nav">
            Login
          </NavLink>
        </aside>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book/:id" element={<BookDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
