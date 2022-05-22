import { createUserWithEmailAndPassword } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import React, { useState } from "react";
import { auth, db } from "../../shared/configs/firebase";
import { useNavigate } from "react-router-dom";

function TherapistRegister() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setDoc(doc(db, "profiles", user.uid), {
          fullname,
          email,
          password,
          role: "therapist",
        })
          .then((res) => {
            setLoading(false);
            navigate("/");
          })
          .catch((error) => {
            alert(error.message);
            setLoading(false);
          });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        setLoading(false);
        // ..
      });
  };
  return (
    <div className="flex flex-col items-center justify-center w-screen pt-20 pb-20">
      <form onSubmit={handleRegister} className="w-80">
        <div className="form-row">
          <label htmlFor="">Full name</label>
          <input
            className="form-input"
            type="text"
            required
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="">Email</label>
          <input
            className="form-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Register
        </button>
      </form>
    </div>
  );
}

export default TherapistRegister;
