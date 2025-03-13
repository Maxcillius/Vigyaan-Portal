import { createContext, useState, useEffect } from "react";
import axios from "axios";
const server = import.meta.env.VITE_SERVER_URL;
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = () => {
    localStorage.setItem("token", token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const loadUser = () => {
    // Always attach the token to subsequent requests
    axios.defaults.headers.common["Authorization"] = `${user.token}`;
    axios
      .get(`${server}/vigyaanportal/v1/users/me`)
      .then((res) => {
        console.log(res.data); // see the user info from server
        if (res.data.ok && res.data.response) {
          // Merge new data into the existing user object
          setUser((prevUser) => ({
            ...prevUser,
            ...res.data.response,
          }));
        }
      })
      .catch((err) => {
        toast.error("You have been logged out. Please login again.");
        logout();
        console.error(err);
      });
  };

  useEffect(() => {
    loadUser();
  }, [user?.token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
