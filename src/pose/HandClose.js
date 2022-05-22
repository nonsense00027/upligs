import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

export const handCloseGesture = new GestureDescription("handClose");

// thumb:
handCloseGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
handCloseGesture.addDirection(
  Finger.Thumb,
  FingerDirection.DiagonalUpLeft,
  1.0
);
handCloseGesture.addDirection(
  Finger.Thumb,
  FingerDirection.DiagonalUpRight,
  1.0
);

// index:
handCloseGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
handCloseGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.9);
// handCloseGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
// handCloseGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);
// handCloseGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);
// handCloseGesture.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
// handCloseGesture.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);

// middle:
handCloseGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
handCloseGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.9);
// handCloseGesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
// handCloseGesture.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 1.0);
// handCloseGesture.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 1.0);
// handCloseGesture.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 1.0);
// handCloseGesture.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 1.0);

// ring:
handCloseGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
handCloseGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// pinky:
handCloseGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
handCloseGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);
