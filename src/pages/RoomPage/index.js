import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import CallActions from "../../components/CallActions";
import {
  db,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "../../shared/configs/firebase";
import { useAuthContext } from "../../shared/contexts/AuthContext";
// const configuration = {
//   iceServers: [
//     {
//       urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };
const configuration = {
  iceServers: [
    {
      urls: "stun:stun1.l.google.com:19302",
    },
  ],
};

function RoomPage() {
  const params = useParams();
  const history = useNavigate();
  const { user } = useAuthContext();
  const videoRef = useRef();
  const remoteVideoRef = useRef();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [cachedLocalPC, setCachedLocalPC] = useState();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  function cleanupJoin() {
    console.log("cleaning up");
    if (cachedLocalPC) {
      cachedLocalPC.removeStream(localStream);
      cachedLocalPC.close();
    }
    setLocalStream();
    setRemoteStream();
    setCachedLocalPC();
  }

  const isAdmin = async () => {
    const docRef = doc(db, "meetings", params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().admin === user.id;
    } else {
      history("/");
    }
  };

  useEffect(() => {
    startLocalStream();
    return () => {
      cleanupJoin();
    };
  }, []);

  useEffect(() => {
    if (params.id && user) {
      isAdmin().then((res) => {
        console.log("admin ko");
        if (localStream) {
          if (res) {
            console.log("start call");
            startCall();
          } else {
            console.log("join call");
            joinCall();
          }
        }
      });
    } else {
      console.log("wala nisulod");
    }
  }, [localStream, params.id, user]);

  const startLocalStream = async () => {
    const myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: isVideoOn
        ? {
            width: { min: 500, ideal: 1280, max: 1920 },
            height: { min: 200, ideal: 720, max: 1080 },
          }
        : false,
    });

    setLocalStream(myStream);
    videoRef.current.srcObject = myStream;
  };

  //   START CALL

  const startCall = async () => {
    console.log("STARTING CALL");
    const localPC = new RTCPeerConnection(configuration);
    // localPC.addStream(localStream);

    const roomRef = doc(db, "meetings", params.id);

    localPC.onicecandidate = (e) => {
      if (!e.candidate) {
        console.log("Got final candidate!");
        return;
      }
      setDoc(
        roomRef,
        { offer: localPC.localDescription.toJSON() },
        { merge: true }
      );
    };

    let remoteVideo;

    // DETECTING DISCONNECTION
    localPC.oniceconnectionstatechange = function () {
      if (localPC.iceConnectionState == "disconnected") {
        console.log("Disconnected");
        localPC.restartIce();
        remoteVideo = new MediaStream();
        setRemoteStream(null);
        getDoc(roomRef).then((doc) => {
          setDoc(roomRef, {
            admin: doc.data().admin,
            offer: doc.data().offer,
          });
          startCall();
        });
      }
    };

    localStream.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    remoteVideo = new MediaStream();

    // Pull tracks from remote stream, add to video stream
    localPC.ontrack = (event) => {
      console.log("pulling remote tracks");
      event.streams[0].getTracks().forEach((track) => {
        remoteVideo.addTrack(track);
      });
    };

    setRemoteStream(remoteVideo);

    remoteVideoRef.current.srcObject = remoteVideo;

    // localPC.onaddstream = (e) => {
    //   if (e.stream && remoteStream !== e.stream) {
    //     console.log("RemotePC received the stream call", e.stream);
    //     setRemoteStream(e.stream);
    //     remoteVideoRef.current.srcObject = e.stream;
    //   } else {
    //     console.log("my stream added");
    //   }
    // };

    const offer = await localPC.createOffer();
    await localPC.setLocalDescription(offer);

    onSnapshot(roomRef, async (snapshot) => {
      console.log("changes");
      const data = snapshot.data();
      if (!localPC.currentRemoteDescription && data.answer) {
        console.log("nisulod ko");
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await localPC.setRemoteDescription(rtcSessionDescription);
      }
    });

    // setCachedLocalPC(localPC);
  };

  //   JOIN CALL

  const joinCall = async () => {
    const roomRef = doc(db, "meetings", params.id);
    const roomSnapshot = await getDoc(roomRef);

    if (!roomSnapshot.exists) return;
    const localPC = new RTCPeerConnection(configuration);
    // localPC.addStream(localStream);

    localPC.onicecandidate = (e) => {
      if (!e.candidate) {
        console.log("Got final candidate!");
        return;
      }
      setDoc(
        roomRef,
        { answer: localPC.localDescription.toJSON() },
        { merge: true }
      );
    };

    localStream.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    const remoteVideo = new MediaStream();

    // Pull tracks from remote stream, add to video stream
    localPC.ontrack = (event) => {
      console.log("pulling remote tracks");
      event.streams[0].getTracks().forEach((track) => {
        remoteVideo.addTrack(track);
      });
    };

    setRemoteStream(remoteVideo);

    remoteVideoRef.current.srcObject = remoteVideo;

    // localPC.onaddstream = (e) => {
    //   if (e.stream && remoteStream !== e.stream) {
    //     console.log("RemotePC received the stream join", e.stream);
    //     setRemoteStream(e.stream);
    //     remoteVideoRef.current.srcObject = e.stream;
    //   }
    // };

    const offer = roomSnapshot.data().offer;
    await localPC.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await localPC.createAnswer();
    await localPC.setLocalDescription(answer);

    setCachedLocalPC(localPC);
  };

  return (
    <div className="h-screen w-screen bg-gray-900 px-32">
      <div className="h-full w-full grid grid-cols-2 place-items-center gap-3">
        {localStream && (
          <video
            className="room__video object-contain -scale-x-100"
            ref={videoRef}
            autoPlay
            playsInline
            muted
          ></video>
        )}
        {remoteStream && (
          <video
            className="room__video object-contain -scale-x-100"
            ref={remoteVideoRef}
            autoPlay
            playsInline
          ></video>
        )}
      </div>

      {/* <CallActions /> */}
    </div>
  );
}

export default RoomPage;
