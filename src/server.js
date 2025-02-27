import connectMongoDB from "./libs/mongodb.js";
import movieRoutes from "./routes/movieRoutes.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 

dotenv.config();
const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

connectMongoDB();
app.use(express.json()); 

app.use("/api/movies", movieRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));