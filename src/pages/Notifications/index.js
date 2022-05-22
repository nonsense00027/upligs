import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { collectIdsAndDocs } from "../../shared/utilities";
import { db } from "../../shared/configs/firebase";
import PatientCard from "../../components/PatientCard";
import { useAuthContext } from "../../shared/contexts/AuthContext";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  console.log("notifications: ", notifications);

  useEffect(() => {
    (async function () {
      const q = query(
        collection(db, "profiles", user.id, "notifications"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      setNotifications(querySnapshot.docs.map((doc) => collectIdsAndDocs(doc)));
    })();
  }, [user]);

  const joinMeeting = (meeting) => {
    navigate(`/room/${meeting}`);
  };
  return (
    <div className="pt-32 max-w-screen-xl mx-auto">
      <h1 className="font-bold text-2xl mb-5">Notifications</h1>
      <div className="flex flex-col">
        {notifications.map((patient) => (
          <div
            className="flex justify-between w-full cursor-pointer bg-gray-100 border border-gray-200 rounded-sm py-2 px-4"
            onClick={() => joinMeeting(patient.meetingRef)}
          >
            <p>Join the Meeting</p>
            <p>
              {moment(new Date(patient.timestamp.toDate())).format(
                "MMMM Do YYYY, h:mm a"
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
