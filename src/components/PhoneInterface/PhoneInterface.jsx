import React, { useContext, useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../contexts/StoreContext";
import useOutgoingCall from "../../hooks/useOutgoingCall";
import { endCall } from "../../utils/SIPService";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import styles from "./PhoneInterface.module.scss";

const PhoneInterface = observer(() => {
  const [number, setNumber] = useState("");
  const { callStore } = useContext(StoreContext);
  const { handleMakeCall, audioRef } = useOutgoingCall();
  const audioTappingRef = useRef(new Audio("assets/keyboard-sound.mp3"));

  useEffect(() => {
    const playTappingSound = () => {
      if (callStore.callStatus === "") {
        audioTappingRef.current.play();
      }
    };

    const keyboardElement = document.querySelector(".simple-keyboard");
    if (keyboardElement) {
      keyboardElement.addEventListener("click", playTappingSound);
    }

    return () => {
      if (keyboardElement) {
        keyboardElement.removeEventListener("click", playTappingSound);
      }
    };
  }, [callStore.callStatus]);

  const handleHangup = () => {
    if (
      callStore.callStatus === "В процессе" ||
      callStore.callStatus === "Вызов"
    ) {
      endCall(callStore.currentCall);
      setNumber("");
    }
  };

  const handleCall = (inputNumber) => {
    if (inputNumber) {
      handleMakeCall(inputNumber);
      setNumber("");
    }
  };

  const handleChange = (event) => {
    const input = event.target.value;
    const filteredInput = input.replace(/[^0-9]/g, "");
    if (callStore.callStatus === "") {
      setNumber(filteredInput);
    }
  };

  const handleKeyPress = (button) => {
    if (button === "{backspace}") {
      setNumber(number.slice(0, -1));
    } else if (button === "{call}") {
      if (
        callStore.callStatus === "В процессе" ||
        callStore.callStatus === "Вызов"
      ) {
        handleHangup();
      } else {
        handleCall(number);
      }
    }
  };

  return (
    <div className={styles.phoneInterface}>
      <div className={styles.screen}>
        <p className={styles.callStatus}>{callStore.callStatus}</p>
        <input
          className={styles.input}
          value={number}
          onChange={handleChange}
          placeholder="Введите номер"
          readOnly={callStore.callStatus !== ""}
        />
      </div>
      <Keyboard
        onChange={setNumber}
        onKeyPress={handleKeyPress}
        layout={{
          default: ["1 2 3", "4 5 6", "7 8 9", "{backspace} 0 {call}"],
        }}
        display={{
          "{backspace}": "⌫",
          "{call}": "&#128222;",
        }}
        buttonTheme={[
          {
            class:
              callStore.callStatus === "В процессе" ||
              callStore.callStatus === "Вызов"
                ? styles["hg-button-hangup"]
                : styles["hg-button-call"],
            buttons: "{call}",
          },
        ]}
        physicalKeyboardHighlight={true}
      />
      <audio ref={audioRef} autoPlay />
    </div>
  );
});

export default PhoneInterface;
