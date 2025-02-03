import { useState } from "react";
import useAuthContext from "./useAuthContext";
import axios from "axios";
import Notify from "../utils/notificationHelper";
import { useNavigate } from "react-router-dom";

function useUserController() {
  const { dispatch } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"; // Fallback to local for development

  const signup = async (email, password) => {
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/users/signup`, {
        email,
        password,
      });
      const json = await response.data;

      Notify("Congratulations", "You were successfuly registered", true);
      localStorage.setItem("user", JSON.stringify(json));

      dispatch({ type: "LOGIN", payload: json });
    } catch (err) {
      Notify("Oops!, something went wrong", err.response.data, false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, {
        email,
        password,
      });
      const json = await response.data;

      Notify("Welcome back!", "You were successfully logged in", true);
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
    } catch (err) {
      Notify("Oops!, something went wrong", err.response.data, false);
    } finally {
      setLoading(false);
    }
  };

  const logout = (forced) => {
    forced ? null : Notify("Bye", "You were sucessfully logged out", true);
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/home");
  };

  return { signup, login, logout, loading };
}

export default useUserController;
