import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { createSocket } from "./socket.js";
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
const server = http.createServer(app);
createSocket(server);
server.listen(3001, () => {
  console.log("시작");
});
