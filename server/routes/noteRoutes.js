import { getAllNotes, getOneNote, createNote, updateNote, deleteNote, upload } from "../controllers/noteController.js"
import express from "express"
import requreAuth from "../middleware/requireAuth.js"

const noteRoutes = express.Router()
noteRoutes.use(requreAuth)

noteRoutes.get("/", getAllNotes)

noteRoutes.post("/", upload.single("audioFile"), createNote);
// .post(createNote)
noteRoutes.route("/:id")
    .get(getOneNote)    

    .put(updateNote)

    .delete(deleteNote)
export default noteRoutes