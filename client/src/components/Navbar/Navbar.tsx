import { useEffect } from "react";
import NavButton from "./NavButton/NavButton";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  function getUserDetails() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/detail`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          localStorage.setItem("username", data.data.name);
          localStorage.setItem("email", data.data.email);
          localStorage.setItem("uid", data.data.id);
        }
        console.log("Message:", data);
      })
      .catch((error) => {
        console.error("Couldn't get user details:", error);
      });
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="navbar">
      <div className="nav-logo">
        <Link to="/home">
          <img src="./images/cashcut-logo.svg" alt="CashCut" />
        </Link>
      </div>
      <div className="nav-links">
        <Link to={"/history"}>Previous Records</Link>
        <NavButton />
      </div>
    </div>
  );
}

export default Navbar;
