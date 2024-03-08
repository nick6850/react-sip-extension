import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext, StoreProvider } from "./contexts/StoreContext";

import Loading from "./components/Common/Loading/Loading";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import IncomingCall from "./components/IncomingCall/IncomingCall";
import PhoneInterface from "./components/PhoneInterface/PhoneInterface";
import CallHistory from "./components/CallHistory/CallHistory";

import styles from "./App.module.scss";

const App = observer(() => {
  const { userStore, callStore } = useContext(StoreContext);
  const [showHistory, setShowHistory] = useState(false);

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

  return (
    <StoreProvider>
      <main>
        <img src="assets/logo.jpg" alt="logo" className={styles.logo} />
        {userStore.isSIPConnecting ? (
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
            <button
              onClick={toggleHistory}
              className={styles.showHistoryButton}
            >
              {showHistory ? "Назад к звонкам" : "Показать историю"}
            </button>
          </>
        )}
      </main>
    </StoreProvider>
  );
});

export default App;
