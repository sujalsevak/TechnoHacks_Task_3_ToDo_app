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

// Connect to database
try {
  await connectDB();
} catch (error) {
  console.error("❌ Failed to connect to database:", error.message);
  process.exit(1);
}

const app = express();

// UPDATED: Simplified CORS to allow your Vercel frontend
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const PORT = process.env.PORT || 7000;
app.use(express.json());

// UPDATED: Removed the strict Content-Security-Policy block 
// This was likely blocking your connection as well.
app.use("/api/tasks", taskRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running and connected to MongoDB!');
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