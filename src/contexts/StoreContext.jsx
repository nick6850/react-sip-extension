import React, { createContext } from "react";

import userStore from "../stores/UserStore";
import callStore from "../stores/CallStore";

export const StoreContext = createContext({
  callStore,
  userStore,
});

export const StoreProvider = ({ children }) => (
  <StoreContext.Provider value={{ callStore, userStore }}>
    {children}
  </StoreContext.Provider>
);
