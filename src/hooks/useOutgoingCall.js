import { useRef, useContext, useEffect } from "react";
import { makeCall, getSipEventEmitter } from "../utils/SIPService";
import { StoreContext } from "../contexts/StoreContext";

const useOutgoingCall = () => {
  const audioRef = useRef(null);
  const { callStore } = useContext(StoreContext);

  useEffect(() => {
    const sipEventEmitter = getSipEventEmitter();

    const handleAddStream = (stream) => {
      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        audioRef.current.play();
      }
    };

    sipEventEmitter.on("addStream", handleAddStream);

    return () => {
      sipEventEmitter.off("addStream", handleAddStream);
    };
  }, [callStore]);

  const handleMakeCall = (number) => {
    makeCall(number);
  };

  return { handleMakeCall, audioRef };
};

export default useOutgoingCall;
