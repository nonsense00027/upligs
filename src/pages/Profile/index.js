import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../shared/contexts/AuthContext";
import { UserCircleIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import { db } from "../../shared/configs/firebase";
import { doc, updateDoc } from "firebase/firestore";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [fullname, setFullname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [motionRange, setMotionRange] = useState("");

  useEffect(() => {
    if (user) {
      console.log("setting user: ", user);
      setFullname(user.fullname);
      setAge(user.age);
      setGender(user.gender);
      setMotionRange(user.motionRange);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userRef = doc(db, "profiles", user.id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(userRef, {
      fullname,
      age,
      gender,
      motionRange,
    });
    alert("Profile updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="pt-20">
      <form action="" className="flex items-center justify-center">
        <div className="w-96 flex flex-col items-center">
          <UserCircleIcon className="h-20 w-20" />
          <div className="form-row">
            <label htmlFor="">Full name</label>
            <input
              type="text"
              className="form-input"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              disabled={isEditing === false}
            />
          </div>

          {user?.role === "patient" && (
            <>
              <div className="form-row">
                <label htmlFor="">Age</label>
                <input
                  type="text"
                  className="form-input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={isEditing === false}
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
                    disabled={isEditing === false}
                  />
                  <p>Male</p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    required
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    disabled={isEditing === false}
                  />
                  <p>Female</p>
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="">Range of Motion</label>
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    required
                    checked={motionRange === "limited"}
                    onChange={() => setMotionRange("limited")}
                    disabled={isEditing === false}
                  />
                  <p>Limited</p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    required
                    checked={motionRange === "normal"}
                    onChange={() => setMotionRange("normal")}
                    disabled={isEditing === false}
                  />
                  <p>Normal Limits</p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    required
                    checked={motionRange === "hypermobile"}
                    onChange={() => setMotionRange("hypermobile")}
                    disabled={isEditing === false}
                  />
                  <p>Hypermobile</p>
                </div>
              </div>
            </>
          )}

          {isEditing ? (
            <button
              type="submit"
              className="bg-primary w-full text-white py-2 mb-2"
              onClick={handleSave}
            >
              Save Profile
            </button>
          ) : (
            <button
              type="submit"
              className="bg-primary w-full text-white py-2 mb-2"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          )}

          <button
            className="bg-secondary text-white w-full py-2"
            onClick={handleLogout}
            // onClick={() => navigate("/register/patient")}
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
