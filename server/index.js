dotenv.config()

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import noteRoutes from "./routes/noteRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()
const PORT = process.env.PORT || 5000;

// Enable CORS for preflight requests and actual requests
app.use(cors());

app.use(express.json())
app.use(listener)

app.use("/api/notes", noteRoutes)
app.use("/api/users", userRoutes)

function listener(req, res, next) {
    console.log(req.method, req.path)
    next()
}

async function Start() {
    try {
        mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected")).catch(err => console.error("MongoDB connection error:", err));
        app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    }
    catch (err) {
        console.log("Server start error", err)
    }
}
Start()
