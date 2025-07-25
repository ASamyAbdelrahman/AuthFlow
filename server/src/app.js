import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import DBconnection from "./config/database.js";
import { requestLogger, errorLogger } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(requestLogger);

await DBconnection.connect();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use(errorLogger);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});