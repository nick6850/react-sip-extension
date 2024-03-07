import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";

import { StoreContext } from "../../contexts/StoreContext";
import useOutgoingCall from "../../hooks/useOutgoingCall";
import { endCall } from "../../utils/SIPService";

import CallDetails from "../CallDetails/CallDetails";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import styles from "./PhoneInterface.module.scss";

const PhoneInterface = observer(() => {
  const [number, setNumber] = useState("");
  const { callStore } = useContext(StoreContext);
  const { handleMakeCall, audioRef } = useOutgoingCall();

  const handleHangup = () => {
    endCall(callStore.currentCall);
  };

  const handleChange = (input) => {
    setNumber(input);
  };

  const handleKeyPress = (button) => {
    if (button === "{backspace}") {
      setNumber(number.slice(0, -1));
    } else if (button === "{call}" && isCallButtonEnabled) {
      callStore.callStatus === "В процессе"
        ? handleHangup()
        : handleMakeCall(number);
    }
  };

  const isCallButtonEnabled =
    callStore.callStatus === "" || callStore.callStatus === "В процессе";

  return (
    <div className={styles.phoneInterface}>
      <div className={styles.screen}>
        <p className={styles.callStatus}>{callStore.callStatus}</p>
        <input
          className={styles.input}
          value={number}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Введите номер"
        />
        <div className={styles.CallDetails}>
          <CallDetails />
        </div>
      </div>
      <Keyboard
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        layout={{
          default: isCallButtonEnabled
            ? ["1 2 3", "4 5 6", "7 8 9", "{backspace} 0 {call}"]
            : ["1 2 3", "4 5 6", "7 8 9", "{backspace} 0 "],
        }}
        display={{
          "{backspace}": "⌫",
          "{call}": isCallButtonEnabled ? "&#128222;" : "",
        }}
        buttonTheme={[
          isCallButtonEnabled
            ? {
                class:
                  callStore.callStatus === "В процессе"
                    ? styles["hg-button-hangup"]
                    : styles["hg-button-call"],
                buttons: "{call}",
              }
            : null,
        ]}
      />
      <audio ref={audioRef} autoPlay />
    </div>
  );
});

export default PhoneInterface;
