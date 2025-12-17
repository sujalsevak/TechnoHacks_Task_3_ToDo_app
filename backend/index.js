import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import cors from 'cors';
import taskRoutes from './taskRoutes.js';
dotenv.config();

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI environment variable is required");
  process.exit(1);
}

// Connect to database with error handling
try {
  await connectDB();
} catch (error) {
  console.error("❌ Failed to connect to database:", error.message);
  process.exit(1);
}



const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
const PORT = process.env.PORT || 7000;
app.use(express.json());
app.use((req, res, next) => {
  const serverUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; connect-src 'self' ${serverUrl}; script-src 'self'; style-src 'self'`
  );
  next();
});
app.use("/api/tasks", taskRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error.message);
  }
  process.exit(1);
});

