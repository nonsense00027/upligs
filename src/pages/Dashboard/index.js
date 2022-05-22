import React, { useEffect, useState } from "react";
import {
  db,
  doc,
  addDoc,
  collection,
  onSnapshot,
  query,
} from "../../shared/configs/firebase";
import { useAuthContext } from "../../shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [motion, setMotion] = useState(null);

  useEffect(() => {
    if (user) {
      setMotion(user.motionRange);
    }
  }, [user]);

  const handleMotion = (id) => {
    setMotion(id);
  };

  console.log("user: ", user);

  const startNewMeeting = () => {
    const meetingRef = collection(db, "meetings");
    addDoc(meetingRef, { admin: user.id }).then((res) => {
      navigate(`/room/${res.id}`);
    });
  };
  return (
    <div className="h-screen w-screen px-20 flex flex-col items-evenly justify-center">
      {/* <button onClick={startNewMeeting}>Start meeting</button> */}
      <h1 className="text-center mb-10 font-bold text-2xl">Range of Motion</h1>

      <div className="flex gap-10">
        <div
          className={`${
            motion === "limited" && "border-blue-600 bg-blue-200"
          } dashboard-card`}
          // onClick={() => handleMotion("limited")}
        >
          <input
            type="radio"
            checked={motion === "limited"}
            disabled
            onChange={() => {}}
          />
          <p>Limited</p>
        </div>
        <div
          className={`${
            motion === "normal" && "border-blue-600 bg-blue-200"
          } dashboard-card`}
          // onClick={() => handleMotion("normal")}
        >
          <input
            type="radio"
            checked={motion === "normal"}
            onChange={() => {}}
            disabled
          />
          <p>Normal Limits</p>
        </div>
        <div
          className={`${
            motion === "hypermobile" && "border-blue-600 bg-blue-200"
          } dashboard-card`}
          // onClick={() => handleMotion("hypermobile")}
        >
          <input
            type="radio"
            checked={motion === "hypermobile"}
            onChange={() => {}}
            disabled
          />
          <p>Hypermobile</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
