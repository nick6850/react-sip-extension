import React, { useContext, useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../contexts/StoreContext";
import useOutgoingCall from "../../hooks/useOutgoingCall";
import { endCall } from "../../utils/SIPService";
import Keyboard from "react-simple-keyboard";
import CallDetails from "../CallDetails/CallDetails";
import "react-simple-keyboard/build/css/index.css";
import styles from "./PhoneInterface.module.scss";

const PhoneInterface = observer(({ mainRef }) => {
  const [number, setNumber] = useState("");
  const { callStore } = useContext(StoreContext);
  const { handleMakeCall, audioRef } = useOutgoingCall();
  const keyboardRef = useRef();
  const audioTappingRef = useRef(new Audio("assets/keyboard-sound.mp3"));

  const handleCall = (inputNumber) => {
    if (inputNumber) {
      handleMakeCall(inputNumber);
      setNumber("");
    }
  };

  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setInput(number);
    }
  }, [number]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ("0123456789".includes(event.key)) {
        setNumber((prevNumber) => prevNumber + event.key);
        audioTappingRef.current.play();
      } else if (event.key === "Backspace") {
        setNumber((prevNumber) => prevNumber.slice(0, -1));
        audioTappingRef.current.play();
      } else if (event.key === "Enter") {
        handleCall(number);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [number, handleCall]);

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
        <div className={styles.callDetails}>
          <CallDetails />
        </div>
        <input
          className={styles.input}
          value={number}
          onChange={handleChange}
          placeholder={callStore.callStatus === "" ? "Введите номер" : ""}
          readOnly={callStore.callStatus !== ""}
        />
      </div>
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        onChange={setNumber}
        onKeyPress={handleKeyPress}
        layout={{
          default: ["1 2 3", "4 5 6", "7 8 9", "{backspace} 0 {call}"],
        }}
        display={{
          "{backspace}": "⌫",
          "{call}": "📞",
        }}
        buttonTheme={[
          {
            class: "backspace",
            buttons: "{backspace}",
          },
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
