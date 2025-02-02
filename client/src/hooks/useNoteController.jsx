import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useNoteContext from "../hooks/useNoteContext";
import useAuthContext from "../hooks/useAuthContext";
import useUserController from "../hooks/useUserController";
import Notify from "../utils/notificationHelper";
import axios from "axios";

function useNoteController() {
  const {
    headerConfig,
    headerConfig: { headers },
  } = useAuthContext();
  const { dispatch } = useNoteContext();
  const { logout } = useUserController();
  const [loading, setLoading] = useState(false);
  const [dataloading, setDataLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const getAllNotes = async (sortCriteria, sortBy) => {
    setDataLoading(true);

    try {
      const response = await axios.get("http://localhost:5000/api/notes", {
        params: { sortCriteria, sortBy },
        headers,
      });
      const notes = await response.data;

      dispatch({ type: "SET_NOTES", payload: notes });
      return notes;
    } catch (err) {
      Notify(
        err?.response?.data?.error,
        "Please log in to continue using the app",
        false
      );
      logout(true);
      navigate("/login");
    } finally {
      setDataLoading(false);
    }
  };

  const getOneNote = async (id, setTitle, setContent, editor) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/notes/${id}`,
        headerConfig
      );
      const json = await response.data;

      setTitle(json.title);
      setContent(json.content);
      editor?.commands.setContent(json.content);
    } catch (err) {
      console.log(err);
    }
  };

  const createNote = async (title, content, audioBlob) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    // Only append the audio if it's available
    if (audioBlob) {
      formData.append("audioFile", audioBlob, "recording.wav");
    }

    try {

      const response = await axios.post(
        "http://localhost:5000/api/notes/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...headerConfig.headers,
          },
        }
      );
      const json = await response.data;

      dispatch({ type: "CREATE_NOTE", payload: json });
      Notify("All good!", "Your note was successfully created", true);
      navigate("/home");
    } catch (err) {
      Notify("Oops!, something went wrong", err.response.data, false);
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (title, content, id) => {
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        { title, content },
        headerConfig
      );
      const json = await response.data;

      dispatch({ type: "UPDATE_NOTE", payload: json });
      Notify("All good!", "Your note was successfully updated", true);
      navigate("/home");
    } catch (err) {
      Notify("Oops!, something went wrong", err.response.data.error, false);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    setDeleteLoading(true);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/notes/${id}`,
        headerConfig
      );
      const json = await response.data;

      dispatch({ type: "DELETE_NOTE", payload: json });
      Notify("All good!", "Your note was successfully deleted", true);
      navigate("/home");
    } catch (err) {
      Notify("Oops!, something went wrong", err.response.data, false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    getAllNotes,
    getOneNote,
    createNote,
    updateNote,
    deleteNote,
    loading,
    dataloading,
    deleteLoading,
  };
}

export default useNoteController;
