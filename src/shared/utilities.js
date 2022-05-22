export const collectIdsAndDocs = (doc) => ({ ...doc.data(), id: doc.id });

const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

export const drawHand = (predictions, ctx) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        let finger = Object.keys(fingerJoints)[j];
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

          ctx.beginPath();
          ctx.moveTo(
            landmarks[firstJointIndex][0],
            landmarks[firstJointIndex][1]
          );

          ctx.lineTo(
            landmarks[secondJointIndex][0],
            landmarks[secondJointIndex][1]
          );

          ctx.strokeStyle = "plum";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i][0];
        const y = landmarks[i][1];

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 3 * Math.PI);

        ctx.fillStyle = "aqua";
        ctx.fill();
      }
    });
  }
};

export const drawBox = (landmarks, ctx) => {
  const { x1, y1, x2, y2 } = getBox(landmarks);
  ctx.beginPath();
  ctx.rect(x1, y1, x2 - x1, y2 - y1);
  ctx.stroke();
};

export const isInside = (landmarks, x, y) => {
  const { x1, y1, x2, y2 } = getBox(landmarks);
  if (x > x1 && x < x2 && y > y1 && y < y2) {
    return true;
  } else {
    return false;
  }
};

export const getBox = (landmarks) => {
  const xs = landmarks.map((item) => item[0]).sort();
  const ys = landmarks.map((item) => item[1]).sort();
  const x1 = xs[0];
  const y1 = ys[0];
  const x2 = xs[xs.length - 1];
  const y2 = ys[ys.length - 1];
  return { x1, y1, x2, y2 };
};
