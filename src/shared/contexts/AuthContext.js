import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, db } from "../configs/firebase";
import { doc, onSnapshot } from "@firebase/firestore";
import { collectIdsAndDocs } from "../utilities";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log(user);

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser != null) {
        onSnapshot(doc(db, "profiles", authUser.uid), (doc) => {
          setUser({ email: authUser.email, ...collectIdsAndDocs(doc) });
          // setAuthLoading(false);
        });
      } else {
        setUser(null);
        //   setAuthLoading(false);
      }
    });
  }, []);
  const login = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };
  const logout = () => {
    signOut(auth);
  };
  const payload = useMemo(() => ({ user, login, logout }), [user]);
  return (
    <AuthContext.Provider value={payload}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
