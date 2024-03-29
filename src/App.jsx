import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "./contexts/StoreContext";

import Loading from "./components/Common/Loading/Loading";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import IncomingCall from "./components/IncomingCall/IncomingCall";
import PhoneInterface from "./components/PhoneInterface/PhoneInterface";
import CallHistory from "./components/CallHistory/CallHistory";
import { endCall } from "./utils/SIPService";

import styles from "./App.module.scss";

const App = observer(() => {
  const { userStore, callStore } = useContext(StoreContext);
  const [showHistory, setShowHistory] = useState(false);
  const [micPermission, setMicPermission] = useState("default");

  const toggleHistory = () => {
    if (callStore.callStatus === "") setShowHistory(!showHistory);
  };

  useEffect(() => {
    if (callStore.callStatus !== "") setShowHistory(false);
  }, [callStore.callStatus]);

  //checks if microphone permission is granted
  useEffect(() => {
    const queryMicrophone = async () => {
      const result = await navigator.permissions.query({ name: "microphone" });
      setMicPermission(result.state);
      result.onchange = () => setMicPermission(result.state);
    };

    queryMicrophone();
  }, []);

  //ends call if user leaves the extension
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (callStore.currentCall) {
        endCall(callStore.currentCall);
      }
    };

    window.addEventListener("unload", handleBeforeUnload);

    return () => {
      window.removeEventListener("unload", handleBeforeUnload);
    };
  }, []);

  const openExtensionSettings = () => {
    if (chrome && chrome.tabs && chrome.runtime) {
      chrome.tabs.create({
        url: `chrome://settings/content/siteDetails?site=chrome-extension://${chrome.runtime.id}`,
      });
    }
  };

  return (
    <main>
      <img src="assets/logo.jpg" alt="logo" className={styles.logo} />
      {micPermission !== "granted" ? (
        <div className={styles.micPermission}>
          <p>
            Расширению для корректной работы необходим доступ к вашему микрофону
          </p>
          <button onClick={openExtensionSettings}>Открыть настройки</button>
        </div>
      ) : userStore.isSIPConnecting ? (
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : !userStore.isRegistered ? (
        <RegistrationForm />
      ) : (
        <>
          <button
            onClick={() => userStore.resetUserStore()}
            className={styles.logoutButton}
          >
            Выйти
          </button>
          {showHistory ? (
            <CallHistory />
          ) : (
            <>
              <IncomingCall />
              <PhoneInterface />
            </>
          )}
          {callStore.callStatus === "" ? (
            <button
              onClick={toggleHistory}
              className={styles.showHistoryButton}
            >
              {showHistory ? "Назад к звонкам" : "Показать историю"}
            </button>
          ) : (
            <span className={styles.footer}>© Made by Никита with ♥️</span>
          )}
        </>
      )}
    </main>
  );
});

export default App;
