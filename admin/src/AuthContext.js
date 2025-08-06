import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  token: null,
  expiresAt: null,
  email: null,
  setToken: () => {},
  setExpiresAt: () => {},
  setEmail: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [email, setEmail] = useState(null);
  const GOOGLE_CLIENT_ID = "157557598338-t2pqe9snt3v728v541h9oh6rcp5ifqjp.apps.googleusercontent.com";
  return (
    <AuthContext.Provider value={{ token, setToken, expiresAt, setExpiresAt , email, setEmail, GOOGLE_CLIENT_ID}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


