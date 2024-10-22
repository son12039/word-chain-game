import { Server } from "socket.io";
export const createSocket = (server) => {
  let list = [];
  const io = new Server(server, {
    cors: {
      cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
      },
    },
  });

  io.on("connection", (socket) => {
    console.log(socket.id + "연결");
    io.emit("wordlist", { list: list });
    socket.on("word", (word) => {
      console.log(word.nickname + " : " + word.msg);
      list.push(word);
      io.emit("wordlist", { list: list });
    });
    socket.on("disconnect", () => {
      console.log(socket.id + "끊김");
    });
  });
};