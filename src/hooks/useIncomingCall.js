import { useRef, useContext, useEffect } from "react";
import { answerCall, endCall, getSipEventEmitter } from "../utils/SIPService";
import { StoreContext } from "../contexts/StoreContext";

const useIncomingCall = () => {
  const audioRef = useRef(null);
  const { callStore } = useContext(StoreContext);

  useEffect(() => {
    const sipEventEmitter = getSipEventEmitter();

    const handleIncomingCall = (incomingSession) => {
      if (!incomingSession) return;
      callStore.setCurrentCall(incomingSession, false);
    };

    sipEventEmitter.on("incomingCall", handleIncomingCall);

    return () => {
      sipEventEmitter.off("incomingCall", handleIncomingCall);
    };
  }, [callStore]);

  useEffect(() => {
    if (
      callStore.direction === "Входящий" &&
      callStore.callStatus === "Входящий звонок"
    ) {
      audioRef.current
        .play()
        .catch((e) => console.error("Error playing the audio", e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [callStore.direction, callStore.callStatus]);

  const handleAnswer = () => {
    answerCall(callStore.currentCall);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return {
    handleAnswer,
    handleRefuse: () => endCall(callStore.currentCall),
    audioRef,
    callStore,
  };
};

export default useIncomingCall;
