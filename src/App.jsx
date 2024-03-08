import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "./contexts/StoreContext";

import Loading from "./components/Common/Loading/Loading";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import IncomingCall from "./components/IncomingCall/IncomingCall";
import PhoneInterface from "./components/PhoneInterface/PhoneInterface";
import CallHistory from "./components/CallHistory/CallHistory";

import styles from "./App.module.scss";

const App = observer(() => {
  const { userStore, callStore } = useContext(StoreContext);
  const [showHistory, setShowHistory] = useState(false);
  const [micPermission, setMicPermission] = useState("default");

  const handleLogout = () => {
    userStore.logOut();
  };

  const toggleHistory = () => {
    if (callStore.callStatus === "") {
      setShowHistory(!showHistory);
    }
  };

  useEffect(() => {
    if (callStore.callStatus !== "") {
      setShowHistory(false);
    }
  }, [callStore.callStatus]);

  useEffect(() => {
    navigator.permissions.query({ name: "microphone" }).then((result) => {
      setMicPermission(result.state);

      result.onchange = () => {
        setMicPermission(result.state);
      };
    });
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
          <button onClick={handleLogout} className={styles.logoutButton}>
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
          <button onClick={toggleHistory} className={styles.showHistoryButton}>
            {showHistory ? "Назад к звонкам" : "Показать историю"}
          </button>
        </>
      )}
    </main>
  );
});

export default App;
