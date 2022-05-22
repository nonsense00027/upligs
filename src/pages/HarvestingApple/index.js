import React, { useEffect, useRef, useState } from "react";
import * as ts from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import Webcam from "react-webcam";
import { drawHand, getBox, drawBox, isInside } from "../../shared/utilities";
import { handCloseGesture } from "../../pose/HandClose";
import { useParams } from "react-router-dom";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../shared/configs/firebase";
import { useAuthContext } from "../../shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function HarvestingApple() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const params = useParams();
  console.log("params: ", params.level);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const circleRef = useRef(null);
  const lineRef = useRef(null);
  // const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [startTime, setStartTime] = useState(new Date());
  const [hasCircle, setHasCircle] = useState(false);

  let apples = useRef(0);

  let circlePos = useRef({ x: 250, y: 120 });

  const setLevel = () => {
    console.log("setting level");
    if (params.level == 1) {
      apples.current = 6;
    } else if (params.level == 2) {
      apples.current = 10;
    } else if (params.level == 3) {
      apples.current = 16;
    }
  };

  console.log("apples value: ", apples.current);

  useEffect(() => {
    if (params.level) {
      setLevel();
      var hand;
      (async function () {
        try {
          const net = await handpose.load();
          console.log("Handpose model loaded");
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
        drawLine();
      }

      const hand = await net.estimateHands(video);

      if (hand.length > 0) {
        // const { x1, y1, x2, y2 } = getBox(hand[0].landmarks);
        var ctx = canvasRef.current.getContext("2d");
        const landmarks = hand[0].landmarks;

        drawBox(landmarks, ctx);

        const GE = new fp.GestureEstimator([handCloseGesture]);

        const gesture = await GE.estimate(landmarks, 8);
        console.log(gesture);
        if (
          isInside(landmarks, circlePos.current.x, circlePos.current.y) &&
          gesture.gestures.length > 0
        ) {
          if (circlePos.current.x === 470) {
            // setCirclePos({ x: 450, y: 350 });
            circlePos.current = { x: 250, y: 120 };
            drawCircle(250, 120);
            apples.current = apples.current - 1;
            // setScore((prevScore) => prevScore + 1);
            scoreRef.current = scoreRef.current + 1;
          } else {
            // setCirclePos({ x: 550, y: 150 });
            circlePos.current = { x: 470, y: 420 };
            drawCircle(470, 420);
          }

          console.log("apples: ", apples.current);

          if (apples.current == 0) {
            handleSave();
            return;
          }
        }
      }

      // const ctx = canvasRef.current.getContext("2d");
      // drawHand(hand, ctx);
    }
  };

  const drawLine = (info, style = {}) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const videoHeight = webcamRef.current.video.videoHeight;
      const videoWidth = webcamRef.current.video.videoWidth;

      lineRef.current.width = videoWidth;
      lineRef.current.height = videoHeight;

      const ctx = lineRef.current.getContext("2d");
      const { color = "black", width = 1 } = style;

      ctx.beginPath();
      ctx.moveTo(250, 120);
      ctx.lineTo(470, 420);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
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

  const handleSave = async () => {
    const userRef = doc(db, "profiles", user.id);
    var newHarvestingAppleScore = user.harvestingAppleScore;
    newHarvestingAppleScore[params.level - 1] =
      scoreRef.current > user.harvestingAppleScore[params.level]
        ? scoreRef.current
        : user.harvestingAppleScore[params.level];

    await updateDoc(userRef, {
      harvestingAppleLevel: parseInt(params.level),
      harvestingAppleScore: newHarvestingAppleScore,
    });

    await addDoc(collection(db, "records"), {
      startTime: startTime,
      endTime: new Date(),
      gameId: "harvestingApple",
      gameLabel: "Harvesting Apple",
      ...user,
      gameLevel: params.level,
      gameScore: scoreRef.current,
    });

    alert("Result has been saved successfully");
    navigate("/games/harvesting-apple");
  };

  return (
    <div>
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
      <canvas
        id="myCanvas"
        ref={lineRef}
        className="w-screen h-screen absolute object-contain -scale-x-100"
      />
    </div>
  );
}

export default HarvestingApple;
