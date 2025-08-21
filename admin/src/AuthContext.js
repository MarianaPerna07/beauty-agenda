import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  token: null,
  expiresAt: null,
  email: null,
  setToken: () => {},
  setExpiresAt: () => {},
  setEmail: () => {},
  selectedWorker: null,
  setSelectedWorker: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [email, setEmail] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const GOOGLE_CLIENT_ID = "157557598338-t2pqe9snt3v728v541h9oh6rcp5ifqjp.apps.googleusercontent.com";
  return (
    <AuthContext.Provider value={{
       token, setToken,
       expiresAt, setExpiresAt,
       email, setEmail,
       selectedWorker, setSelectedWorker,
       GOOGLE_CLIENT_ID
     }}>
       {children}
     </AuthContext.Provider>
   );
 }

export function useAuth() {
  return useContext(AuthContext);
}


