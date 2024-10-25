import { Server } from "socket.io";
export const createSocket = (server) => {
  let list = [];
  let previousWord = "";
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
      console.log(word.msg[word.msg.length - 1]);
      console.log(previousWord[0]);
      previousWord = word.msg;
      list.unshift(word); //맨 앞에부터 넣기
      io.emit("wordlist", { list: list });
    });

    socket.on("disconnect", () => {
      console.log(socket.id + "끊김");
    });
  });
};
