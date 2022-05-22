import React from "react";
import main from "../../assets/main.jpg";
import banner from "../../assets/banner.jpg";
import { ArrowCircleRightIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-xl mx-auto h-screen w-screen flex items-center justify-center">
      <div className="flex flex-1 flex-col justify-center">
        <h3 className="text-5xl font-bold">Welcome 👋</h3>
        <p className="text-2xl pr-20 my-4">
          <span className="font-semibold">Upligs</span> is the new healthcare
          solution with the focus on physical rehabilitation of upper extremity.
        </p>
        <button
          className="bg-secondary mt-4 w-60 text-white py-2 rounded-sm text-xl flex items-center gap-2 justify-center transition-all duration-200 hover:bg-secondary-dark ease-out"
          onClick={() => navigate("/login")}
        >
          Get started
          <ArrowCircleRightIcon className="h-8 w-8" />
        </button>
      </div>
      <div className="flex-1">
        <lottie-player
          src="https://assets9.lottiefiles.com/packages/lf20_natclrl9.json"
          background="transparent"
          speed="1"
          style={{ width: 500, height: 500 }}
          loop
          autoplay
        ></lottie-player>
      </div>
    </div>
  );
}

export default Landing;
