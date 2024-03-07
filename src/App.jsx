import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext, StoreProvider } from "./contexts/StoreContext";

import Loading from "./components/Common/Loading/Loading";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import IncomingCall from "./components/IncomingCall/IncomingCall";
import PhoneInterface from "./components/PhoneInterface/PhoneInterface";
import CallHistory from "./components/CallHistory/CallHistory";

import styles from "./App.module.scss";

const App = observer(() => {
  const { userStore } = useContext(StoreContext);

  const handleLogout = () => {
    userStore.logOut();
  };

  return (
    <StoreProvider>
      {userStore.isSIPConnecting ? (
        <Loading />
      ) : !userStore.isRegistered ? (
        <RegistrationForm />
      ) : (
        <main>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </button>
          <IncomingCall />
          <PhoneInterface />
          <CallHistory />
        </main>
      )}
    </StoreProvider>
  );
});

export default App;
