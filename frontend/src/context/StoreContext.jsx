import { createContext, useState } from "react";

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <StoreContext.Provider value={{ user, setUser, logout }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;