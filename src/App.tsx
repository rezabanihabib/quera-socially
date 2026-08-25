// import { useState } from "react";
import "./App.css"
import { Link } from "react-router";

function App() {
  return (
    <>
      <div>Home Page</div>
      <nav>
        <Link to="/">home</Link>
        <br />
        <Link to="/login">Login</Link>
        <br />
        <Link to="/register">register</Link>
        <br />
        <Link to="/notifications">notifications</Link>
        <br />
        <Link to="/profile/:username">profile</Link>
      </nav>
    </>
  );
}

export default App;
