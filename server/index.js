dotenv.config()
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import noteRoutes from "./routes/noteRoutes.js"
import userRoutes from "./routes/userRoutes.js"

// Your backend URL (from Vercel for production)
const allowedOrigins = [
    'https://note-making-hs5mkyx72-sai-rams-projects-0db564e9.vercel.app',  // frontend URL (production)
    'http://localhost:5173',  // frontend URL (for local development)
  ];

const app = express()
const PORT = process.env.PORT || 4000;

// Enable CORS with specific origins
app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
  }));

app.use(cors())
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
