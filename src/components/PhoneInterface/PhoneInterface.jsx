import React, { useContext, useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../contexts/StoreContext";
import useOutgoingCall from "../../hooks/useOutgoingCall";
import { endCall } from "../../utils/SIPService";
import Keyboard from "react-simple-keyboard";
import CallDetails from "../CallDetails/CallDetails";
import "react-simple-keyboard/build/css/index.css";
import styles from "./PhoneInterface.module.scss";

const PhoneInterface = observer(() => {
  const [number, setNumber] = useState("");
  const { callStore } = useContext(StoreContext);
  const { handleMakeCall, audioRef } = useOutgoingCall();
  const keyboardRef = useRef();
  const audioTappingRef = useRef(new Audio("assets/keyboard-sound.mp3"));
  const inputRef = useRef(null);

  const playSound = () => {
    const audio = audioTappingRef.current.cloneNode();
    audio.play();
  };

  const handleCall = (inputNumber) => {
    if (inputNumber) {
      handleMakeCall(inputNumber);
      setNumber("");
    }
  };

  const handleHangup = () => {
    if (callStore.currentCall) {
      endCall(callStore.currentCall);
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
      if (inputRef.current !== document.activeElement) {
        if ("0123456789".includes(event.key)) {
          setNumber((prevNumber) => prevNumber + event.key);
          playSound();
        } else if (event.key === "Backspace") {
          setNumber((prevNumber) => prevNumber.slice(0, -1));
          playSound();
        } else if (event.key === "Enter") {
          handleCall(number);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [number, handleCall]);

  const handleChange = (event) => {
    const input = event.target.value;
    const filteredInput = input.replace(/[^0-9]/g, "");
    setNumber(filteredInput);
  };

  const handleKeyPress = (button) => {
    if (button === "{backspace}") {
      setNumber(number.slice(0, -1));
    } else if (button === "{call}") {
      if (number) {
        handleCall(number);
      } else if (
        callStore.callStatus === "В процессе" ||
        callStore.callStatus === "Вызов"
      ) {
        handleHangup();
      }
    }
    playSound();
  };

  return (
    <div className={styles.phoneInterface}>
      <div className={styles.screen}>
        <p className={styles.callStatus}>{callStore.callStatus}</p>
        <div className={styles.callDetails}>
          <CallDetails />
        </div>
        <input
          ref={inputRef}
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
