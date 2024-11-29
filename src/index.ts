import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";
import { errorHandler } from "./middleware/errorHandler"
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors())
// Routes
app.use(routes);

// Error Handler
app.use(errorHandler);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
