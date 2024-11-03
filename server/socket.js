import { Server } from "socket.io";
import { wordCheck } from "./wordAPI.js";
export const createSocket = (server) => {
  let list = [];
  let userlist = [];
  let previousWord = "";
  let countdown = 5;
  const io = new Server(server, {
    cors: {
      cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
      },
    },
  });
  const reset = () => {
    list = [];
    io.to("testroom").emit("wordList", { list: list });
    previousWord = "";
    countdown = 5;
  };
  io.on("connection", (socket) => {
    console.log(socket.id + "연결");

    socket.on("word", async (word) => {
      const definitions = await wordCheck(word.msg);
      if (definitions) {
        if (word.msg.charAt(0) == previousWord || previousWord == "") {
          previousWord = word.msg.charAt(word.msg.length - 1);
          list.unshift(word);
          io.to("testroom").emit("wordAdd", {
            word: word,
            definitions: definitions,
          });
        } else {
          reset();
          io.to("testroom").emit("unlikeWord", {
            unlike: word.nickname,
          });
        }
      } else {
        reset();
        io.to("testroom").emit("wrongWord", { wrong: word.nickname });
      }
    });
    socket.on("start", (data) => {
      io.to("testroom").emit("start", { startUser: data.nickname });
    });
    socket.on("enter", (data) => {
      socket.join("testroom");
      io.to("testroom").emit("wordList", { list: list });
      userlist[socket.id] = { nickname: data.nickname };
      io.to("testroom").emit("userList", { userlist: Object.values(userlist) });
    });

    socket.on("disconnect", () => {
      if (socket.id in userlist) {
        let a = userlist[socket.id].nickname;
        delete userlist[socket.id];
        io.to("testroom").emit("escapeUser", {
          userlist: Object.values(userlist),
          runuser: a,
        });
      }
      console.log(socket.id + "끊김");
    });
  });
};
