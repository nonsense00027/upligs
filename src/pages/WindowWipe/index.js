import React, { useEffect, useRef, useState } from "react";
import * as ts from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { drawHand, isInside, getBox, drawBox } from "../../shared/utilities";
import { useParams } from "react-router-dom";
import Timer from "../../components/Timer";
import { useAuthContext } from "../../shared/contexts/AuthContext";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../shared/configs/firebase";
import { useNavigate } from "react-router-dom";

function WindowWipe() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const params = useParams();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const circleRef = useRef(null);

  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(new Date());

  const [hasCircle, setHasCircle] = useState(false);
  // let circlePos = useRef({ x: 550, y: 230 });
  let circlePos = useRef({ x: 250, y: 180 });
  let leftCirclePos = useRef(null);
  let rightCirclePos = useRef(null);

  const setLevel = () => {
    if (params.level == 1) {
      leftCirclePos.current = { x: 250, y: 180 };
      rightCirclePos.current = { x: 450, y: 300 };
    } else if (params.level == 2) {
      leftCirclePos.current = { x: 250, y: 200 };
      rightCirclePos.current = { x: 450, y: 320 };
    } else if (params.level == 3) {
      leftCirclePos.current = { x: 250, y: 220 };
      rightCirclePos.current = { x: 450, y: 340 };
    }
  };

  const startGame = () => {
    // setStartTime(new Date());
    // startTime.current = new Date();
    setGameStarted(true);
  };

  useEffect(() => {
    if (params.level) {
      setLevel();
      var hand;

      (async function () {
        try {
          const net = await handpose.load();
          hand = setInterval(() => {
            detect(net);
          }, 500);
        } catch (error) {
          console.log("naay error");
        }
      })();

      return () => {
        clearInterval(hand);
      };
    }
  }, []);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoHeight = webcamRef.current.video.videoHeight;
      const videoWidth = webcamRef.current.video.videoWidth;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      if (!hasCircle) {
        drawCircle(circlePos.current.x, circlePos.current.y);
        setHasCircle(true);
        startGame();
        // setStartTime(new Date());
        // setGameStarted(true);
      }

      const hand = await net.estimateHands(video);
      if (hand.length > 0) {
        var ctx = canvasRef.current.getContext("2d");
        const landmarks = hand[0].landmarks;

        drawBox(landmarks, ctx);

        if (isInside(landmarks, circlePos.current.x, circlePos.current.y)) {
          if (circlePos.current.x === leftCirclePos.current.x) {
            // setCirclePos({ x: 450, y: 350 });
            circlePos.current = rightCirclePos.current;
            drawCircle(rightCirclePos.current.x, rightCirclePos.current.y);
          } else {
            // setCirclePos({ x: 550, y: 150 });
            circlePos.current = leftCirclePos.current;
            drawCircle(leftCirclePos.current.x, leftCirclePos.current.y);
          }
          setScore((prevScore) => prevScore + 1);
        }
      }
    }
  };

  const drawCircle = (x, y) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const videoHeight = webcamRef.current.video.videoHeight;
      const videoWidth = webcamRef.current.video.videoWidth;

      circleRef.current.width = videoWidth;
      circleRef.current.height = videoHeight;

      const ctx = circleRef.current.getContext("2d");

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 10 * Math.PI);

      ctx.fillStyle = "orange";
      ctx.fill();
    }
  };

  const getMinutes = () => {
    if (params.level == 1) {
      return 6;
    } else if (params.level == 2) {
      return 4;
    } else if (params.level == 3) {
      return 2;
    }
  };

  const timeEnded = () => {
    alert("Time ended");
    handleSave();
  };

  const handleSave = async () => {
    const userRef = doc(db, "profiles", user.id);
    var newWindowWipeScore = user.windowWipeScore;
    newWindowWipeScore[params.level - 1] =
      score > user.windowWipeScore[params.level]
        ? score
        : user.windowWipeScore[params.level];
    // Set the "capital" field of the city 'DC'
    await updateDoc(userRef, {
      windowWipeLevel: parseInt(params.level),
      windowWipeScore: newWindowWipeScore,
    });

    await addDoc(collection(db, "records"), {
      startTime: startTime,
      endTime: new Date(),
      gameId: "windowWipe",
      gameLabel: "Window Wipe",
      ...user,
      gameLevel: params.level,
      gameScore: score,
    });

    alert("Result has been saved successfully");
    navigate("/games/window-wipe");
  };

  // runHandpose();
  // drawCircle();

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute top-16 left-0 z-50 flex items-center w-screen justify-between">
        <div className="bg-white px-10">
          <h1>Score: {score}</h1>
        </div>
        <div className="bg-white px-10">
          <h1>Highest Score: {user?.windowWipeScore[params.level - 1]}</h1>
        </div>
      </div>
      <Timer
        initialMinute={getMinutes()}
        initialSeconds={0}
        onEnded={timeEnded}
      />
      <Webcam
        ref={webcamRef}
        className="w-screen h-screen absolute object-contain -scale-x-100"
      />
      <canvas
        id="myCanvas"
        ref={canvasRef}
        className="w-screen h-screen absolute object-contain -scale-x-100"
      />
      <canvas
        id="myCanvas"
        ref={circleRef}
        className="w-screen h-screen absolute object-contain -scale-x-100"
      />
    </div>
  );
}

export default WindowWipe;
