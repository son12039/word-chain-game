import { Server } from "socket.io";
import { wordCheck } from "./wordAPI.js";
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

    socket.on("word", async (word) => {
      const definitions = await wordCheck(word.msg);
      if (definitions) {
        console.log(word.msg.charAt(0), "현");
        console.log(previousWord, "전");

        list.unshift(word);
        io.to("testroom").emit("wordAdd", {
          word: word,
          definitions: definitions,
        });
      } else {
        io.to("testroom").emit("wrongword", { wrong: word.nickname });
      }
      previousWord = word.msg;
    });

    socket.on("enter", (data) => {
      socket.join("testroom");
      io.to("testroom").emit("wordlist", { list: list });
      io.to("testroom").emit("test", { msg: data.nickname + "님 접속" });
      userlist[socket.id] = { nickname: data.nickname };
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
