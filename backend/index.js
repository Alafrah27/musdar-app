import express from "express";
import cookie from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";

dotenv.config();

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cookie());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

const port = process.env.PORT || 4000;

const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/user", userRoutes);

app.use("/api/v2/posts", postRoutes);
app.use("/api/v2/notifications", notificationRoutes);
app.use("/api/v2/connections", connectionRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
app.listen(port, () => {
  connectDB();
  console.log("Server is running on port", port);
});
