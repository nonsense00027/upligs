import { IconButton } from "@mui/material";
import React from "react";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { useAuthContext } from "../shared/contexts/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../shared/configs/firebase";
import { useNavigate } from "react-router-dom";
function PatientCard({ patient }) {
  const navigate = useNavigate();

  const { user } = useAuthContext();

  const startNewMeeting = async () => {
    if (user) {
      const meetingRef = collection(db, "meetings");
      const meeting = await addDoc(meetingRef, { admin: user.id });

      const patientRef = collection(
        db,
        "profiles",
        patient.id,
        "notifications"
      );
      await addDoc(patientRef, {
        meetingRef: meeting.id,
        timestamp: serverTimestamp(),
      });

      navigate(`/room/${meeting.id}`);
    }
  };

  return (
    <div className="border border-gray-200 px-4 py-2 rounded-sm bg-gray-100">
      <h1 className="font-semibold">{patient.fullname}</h1>
      <p className="opacity-60 italic text-sm">{patient.email}</p>
      <div className="float-right">
        <IconButton aria-label="delete" onClick={startNewMeeting}>
          <VideoCallIcon className="text-green-700" />
        </IconButton>
      </div>
    </div>
  );
}

export default PatientCard;
