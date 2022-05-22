import React from "react";
import { PlayIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../shared/contexts/AuthContext";

function Card({ title, link, path }) {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleNavigate = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="w-96 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-md cursor-pointer"
      onClick={() => handleNavigate(`/games/${path}`)}
    >
      <div className="bg-white p-2">
        <h3 className="text-center font-semibold">{title}</h3>
      </div>
      <div>
        <lottie-player
          src={link}
          background="transparent"
          speed="1"
          style={{ width: 300, height: 300 }}
          loop
          autoplay
        ></lottie-player>
      </div>
      <button className="bg-secondary text-white text-xl font-semibold py-1 w-full rounded-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-secondary-dark ease-out">
        Play <PlayIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default Card;
