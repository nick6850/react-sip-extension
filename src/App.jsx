import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext, StoreProvider } from "./contexts/StoreContext";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import PhoneInterface from "./components/PhoneInterface/PhoneInterface";
import CallHistory from "./components/CallHistory/CallHistory";
import Loading from "./components/Common/Loading/Loading";

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
          <button onClick={handleLogout}>Выйти</button>
          <PhoneInterface />
          <CallHistory />
        </main>
      )}
    </StoreProvider>
  );
});

export default App;
