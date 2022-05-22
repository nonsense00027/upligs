import { createUserWithEmailAndPassword } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import React, { useState } from "react";
import { auth, db } from "../../shared/configs/firebase";
import { useNavigate } from "react-router-dom";

function PatientRegister() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [motionRange, setMotionRange] = useState("limited");
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
          age,
          gender,
          motionRange,
          email,
          password,
          role: "patient",
          windowWipeLevel: 0,
          windowWipeScore: [0, 0, 0],
          harvestingAppleLevel: 0,
          harvestingAppleScore: [0, 0, 0],
          rowBoatLevel: 0,
          rowBoatScore: [0, 0, 0],
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
          <label htmlFor="">Age</label>
          <input
            className="form-input"
            type="number"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="">Gender</label>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              required
              checked={gender === "male"}
              onChange={() => setGender("male")}
            />
            <p>Male</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              required
              checked={gender === "female"}
              onChange={() => setGender("female")}
            />
            <p>Female</p>
          </div>
        </div>
        <div className="form-row">
          <label htmlFor="">Select Range of Motion</label>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              required
              checked={motionRange === "limited"}
              onChange={() => setMotionRange("limited")}
            />
            <p>Limited</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              required
              checked={motionRange === "normal"}
              onChange={() => setMotionRange("normal")}
            />
            <p>Normal Limits</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              required
              checked={motionRange === "hypermobile"}
              onChange={() => setMotionRange("hypermobile")}
            />
            <p>Hypermobile</p>
          </div>
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

export default PatientRegister;
