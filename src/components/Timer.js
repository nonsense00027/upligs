import React from "react";
import { useState, useEffect } from "react";

const Timer = ({ initialMinute, initialSeconds, onEnded }) => {
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
          onEnded();
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <div className="absolute bottom-0 left-0 z-50 flex items-center justify-center w-screen bg-white">
      {minutes === 0 && seconds === 0 ? null : (
        <h1 className="text-2xl font-bold">
          {" "}
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </h1>
      )}
    </div>
  );
};

export default Timer;
