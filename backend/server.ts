import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON requests
app.use("/auth", authRoutes); // Attach auth routes

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));