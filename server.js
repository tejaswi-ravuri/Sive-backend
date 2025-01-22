import express from "express";
import cors from "cors"; // Import cors package
import dotenv from "dotenv";
import path from "path";

import connect from "./connectDB/connect.js";
import projectRouter from "./routes/project.route.js";
import blogRouter from "./routes/blogs.route.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(cors()); // Enable CORS for all origins

app.use(express.json());

app.use("/api/projects", projectRouter);
app.use("/api/blogs", blogRouter);

app.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});
