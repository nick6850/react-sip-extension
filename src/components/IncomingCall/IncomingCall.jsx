import React from "react";
import { observer } from "mobx-react-lite";
import useIncomingCall from "../../hooks/useIncomingCall";

const IncomingCall = observer(() => {
  const { handleAnswer, handleRefuse, audioRef, callStore } = useIncomingCall();

  return (
    callStore.direction === "Входящий" &&
    callStore.callStatus === "Входящий звонок" && (
      <div>
        <div>Входящий звонок</div>
        <div>{callStore.contactNumber}</div>
        <button onClick={handleAnswer}>Принять</button>
        <button onClick={handleRefuse}>Сбросить</button>
        <audio ref={audioRef} loop>
          <source src="assets/ringtone.mp3" type="audio/mp3" />
        </audio>
      </div>
    )
  );
});

export default IncomingCall;
