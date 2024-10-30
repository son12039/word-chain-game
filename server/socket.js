import { Server } from "socket.io";
export const createSocket = (server) => {
  let list = [];
  let userlist = [];
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
      previousWord = word.msg;
      list.unshift(word); //맨 앞에부터 넣기
      io.emit("wordlist", { list: list });
    });
    socket.on("enter", (data) => {
      socket.join("testroom");
      io.to("testroom").emit("test", { msg: data.nickname + "님 접속" });
      userlist[socket.id] = { nickname: data.nickname };
      console.log(userlist);
      io.to("testroom").emit("userlist", { userlist: Object.values(userlist) });
    });

    socket.on("disconnect", () => {
      if (socket.id in userlist) {
        delete userlist[socket.id];
        io.to("testroom").emit("userlist", {
          userlist: Object.values(userlist),
        });
      }
      console.log(socket.id + "끊김");
    });
  });
};
