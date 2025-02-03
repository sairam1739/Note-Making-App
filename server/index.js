import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import noteRoutes from "./routes/noteRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config()

// Your backend URL (from Vercel for production)
const allowedOrigins = [
    'https://note-making-ay7k6gl0h-sai-rams-projects-0db564e9.vercel.app',  // frontend URL (production)
    'http://localhost:5173',  // frontend URL (for local development)
  ];

const app = express()
const PORT = process.env.PORT || 4000;

// Enable CORS for preflight requests and actual requests
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add supported methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Add allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers)
}));

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
