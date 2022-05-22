import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="h-screen flex flex-col items-center justify-center w-screen">
      <form onSubmit={handleLogin} className="w-80">
        <div className="form-row">
          <label htmlFor="">Email</label>
          <input
            className="form-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-row">
          <label htmlFor="">Password</label>
          <input
            className="form-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-primary w-full text-white py-2">
          Login
        </button>

        <div className="mt-10">
          <button
            className="bg-secondary text-white w-full py-2"
            onClick={() => navigate("/register/patient")}
          >
            Register as Patient
          </button>
          <button
            className="bg-gray-200 w-full py-2 mt-2"
            onClick={() => navigate("/register/therapist")}
          >
            Register as Physical Therapist
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
