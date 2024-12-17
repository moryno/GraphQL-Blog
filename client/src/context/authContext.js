import { createContext, useEffect, useState } from "react";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

export const UserContext = createContext(INITIAL_STATE);
export const ContextProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        onLogin: setState,
        isAuthenticated: !!state.user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
