import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import { connectDB } from "./db/prisma.js";
import Routes from "./routes/index.route.js";

dotenv.config();

const app = express();
const port_server = process.env.APP_PORT_SEVER;
const port_client = process.env.APP_PORT_CLIENT;

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
  try {
    await connectDB();
    app.listen(port_server, () => {
      console.log(`Server đang chạy tại: http://localhost:${port_server}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database. Server not started.", error);
    process.exit(1);
  }
}

startServer();
