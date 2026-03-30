import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import { connectDB } from "./db/prisma.js";
import Routes from "./routes/index.route.js";

dotenv.config();

const app = express();
const port_server = process.env.APP_PORT_SERVER || process.env.PORT || 5000;
const port_client = process.env.APP_PORT_CLIENT || 5173;

// Middleware
app.use(cors({
  origin: `http://localhost:${port_client}`, // Cho phép React của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Quan trọng để gửi token/cookie sau này
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Routes(app);

async function startServer() {
  app.listen(port_server, () => {
    console.log(`Server đang chạy tại: http://localhost:${port_server}`);
  });

  connectDB().catch((error) => {
    console.error("Database startup warning:", error?.message ?? error);
  });
}

startServer();
