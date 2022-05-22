import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../shared/contexts/AuthContext";

function Level() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleRedirect = (level) => {
    navigate(`/games/row-boat/${level}`);
  };

  const getClassname = (level) => {
    if (!user) return "bg-gray-200";
    if (user?.rowBoatLevel < level) {
      return "bg-gray-200";
    } else {
      return "bg-primary";
    }
  };

  return (
    <div className="pt-20 flex flex-col gap-5 items-center justify-center min-h-screen">
      <div>
        <h1 className="font-bold text-2xl">General Instruction:</h1>
        <p className="text-lg">
          Adjust to a comfortable position and ensure proper lighting to play
          the game.
        </p>
        <h1 className="font-bold text-xl mt-5">Row the Boat Instructions:</h1>
        <ul className="list-disc text-lg">
          <li>Level 1, the repetition of rowing must be 2 times.</li>
          <li>Level 2, the repetition rowing will be 4 times.</li>
          <li>Level 3, the repetition rowing must be 6 times.</li>
        </ul>
        <p>
          Note: This game is an open time and failure to complete the repetition
          for each level will be required to redo the level.
        </p>
      </div>
      <button
        className="w-80 bg-primary text-white py-2 text-lg rounded-sm"
        onClick={() => handleRedirect(1)}
      >
        Level 1
      </button>
      <button
        className={`w-80  text-white py-2 text-lg rounded-sm ${getClassname(
          1
        )}`}
        onClick={() => handleRedirect(2)}
      >
        Level 2
      </button>
      <button
        className={`w-80 text-white py-2 text-lg rounded-sm ${getClassname(2)}`}
        onClick={() => handleRedirect(3)}
      >
        Level 3
      </button>
    </div>
  );
}

export default Level;
