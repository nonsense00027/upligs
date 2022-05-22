import React, { useRef } from "react";
import "./App.css";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Games from "./pages/Games";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HarvestingApple from "./pages/HarvestingApple";
import WindowWipe from "./pages/WindowWipe";
import RowBoat from "./pages/RowBoat";
import Login from "./pages/Authentication/Login";
import PatientRegister from "./pages/Authentication/PatientRegister";
import { useAuthContext } from "./shared/contexts/AuthContext";
import LevelApple from "./pages/HarvestingApple/Level";
import LevelWipe from "./pages/WindowWipe/Level";
import LevelBoat from "./pages/RowBoat/Level";
import RoomPage from "./pages/RoomPage";
import TherapistRegister from "./pages/Authentication/TherapistRegister";
import Timer from "./components/Timer";
import Admin from "./pages/Admin";
import Patients from "./pages/Patients";
import Notifications from "./pages/Notifications";

function App() {
  const { user } = useAuthContext();
  console.log("user is: ", user);
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/room/:id" element={<RoomPage />} />
          <Route path="/games/row-boat/:level" element={<RowBoat />} />
          <Route path="/games/row-boat" element={<LevelBoat />} />
          <Route path="/games/window-wipe/:level" element={<WindowWipe />} />
          <Route path="/games/window-wipe" element={<LevelWipe />} />
          <Route
            path="/games/harvesting-apple/:level"
            element={<HarvestingApple />}
          />
          <Route path="/games/harvesting-apple" element={<LevelApple />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/games" element={<Games />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/register/therapist" element={<TherapistRegister />} />
          <Route path="/register/patient" element={<PatientRegister />} />
          <Route path="/login" element={<Login />} />
          {user ? (
            user.role === "therapist" ? (
              <Route path="/" element={<Admin />} />
            ) : (
              <Route path="/" element={<Dashboard />} />
            )
          ) : (
            <Route path="/" element={<Landing />} />
          )}
        </Routes>
      </Router>
      {/* <Webcam
        ref={webcamRef}
        className="w-screen h-screen absolute object-cover"
      />
      <canvas ref={canvasRef} className="w-screen h-screen absolute" /> */}
    </div>
  );
}

export default App;
