import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../shared/contexts/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const checkActive = ({ isActive }) => {
    return isActive ? "navbar text-primary" : "navbar";
  };

  return (
    <div className="py-4 fixed z-50 bg-white w-full">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-2xl">Upligs</h3>
        </div>
        <div className="flex items-center gap-6">
          <NavLink to="/" className={checkActive}>
            Home
          </NavLink>
          {user?.role === "patient" && (
            <>
              <NavLink to="/about" className={checkActive}>
                About
              </NavLink>
              <NavLink to="/games" className={checkActive}>
                Games
              </NavLink>
              <NavLink to="/contact" className={checkActive}>
                Contact
              </NavLink>
              <NavLink to="/notifications" className={checkActive}>
                Notifications
              </NavLink>
            </>
          )}
          {user?.role === "therapist" && (
            <>
              <NavLink to="/patients" className={checkActive}>
                Patients
              </NavLink>
            </>
          )}

          {user ? (
            <button
              className="bg-primary text-white rounded-sm px-8 py-1 hover:bg-primary-dark transition-all duration-150 ease-out"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
          ) : (
            <button
              className="bg-primary text-white rounded-sm px-8 py-1 hover:bg-primary-dark transition-all duration-150 ease-out"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
