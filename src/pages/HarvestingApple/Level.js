import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../shared/contexts/AuthContext";

function Level() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleRedirect = (level) => {
    navigate(`/games/harvesting-apple/${level}`);
  };

  const getClassname = (level) => {
    if (!user) return "bg-gray-200";
    if (user?.harvestingAppleLevel < level) {
      return "bg-gray-200";
    } else {
      return "bg-primary";
    }
  };

  console.log("level: ", user?.harvestingAppleLevel);

  return (
    <div className="pt-20 flex flex-col gap-5 items-center justify-center min-h-screen">
      <div>
        <h1 className="font-bold text-2xl">General Instruction:</h1>
        <p className="text-lg">
          Adjust to a comfortable position and ensure proper lighting to play
          the game.
        </p>
        <h1 className="font-bold text-xl mt-5">Window wipe Instructions:</h1>
        <ul className="list-disc text-lg">
          <li>Level 1 the required apples to pick is 6.</li>
          <li>Level 2 would be 10 apples.</li>
          <li>Level 3 would be 16 apples.</li>
        </ul>
        <p>
          Note: The user can not proceed to the next level unless they finished
          the previous level. <br /> This is to ensure that the user will gain
          improvement and to ensure the completion of the said task.
        </p>
      </div>
      <button
        className="w-80 bg-primary text-white py-2 text-lg rounded-sm"
        onClick={() => handleRedirect(1)}
      >
        Level 1
      </button>
      <button
        className={`w-80 text-white py-2 text-lg rounded-sm ${getClassname(1)}`}
        onClick={() => handleRedirect(1)}
        disabled={!user?.harvestingAppleLevel && user?.harvestingAppleLevel < 1}
      >
        Level 2
      </button>
      <button
        className={`w-80 text-white py-2 text-lg rounded-sm ${getClassname(2)}`}
        onClick={() => handleRedirect(2)}
        disabled={user?.harvestingAppleLevel < 2}
      >
        Level 3
      </button>
    </div>
  );
}

export default Level;
