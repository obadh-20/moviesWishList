import { config } from "dotenv";
config();
import express from "express";
import movieRoutes from "./routes/movieRoutes.js"
import auth from "./routes/auth.js"
import watchlist from "./routes/watchList.js"
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const PORT = 4000;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000", // البورت اللي يعمل عليه Next
    credentials: true, // مهم عشان Cookie تنتقل
}));
app.use("/movies", movieRoutes);
app.use("/auth", auth);
app.use("/watchlist", watchlist);

app.listen(PORT, () => {
    console.log("server is running on port http://localhost:" + PORT);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});


