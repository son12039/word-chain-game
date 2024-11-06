import { Server } from "socket.io";
import { wordCheck } from "./wordAPI.js";
export const createSocket = (server) => {
  let list = [];
  let userlist = [];
  let previousWord = "";
  let started = false;

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
  };

  io.on("connection", (socket) => {
    console.log(socket.id + "연결");
    socket.on("started", () => {
      console.log("엥");
      socket.emit("started", { started });
    });

    socket.on("word", async (word) => {
      if (list.some((item) => item.msg === word.msg)) {
        reset();
        io.to("testroom").emit("overlapWord", {
          overlapWord: word.nickname,
        });
      } else {
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
      }
    });
    socket.on("start", (data) => {
      io.to("testroom").emit("start", { startUser: data.nickname });
    });
    socket.on("end", () => {
      io.to("testroom").emit("end", { userlist: Object.values(userlist) });
    });

    socket.on("enter", (data) => {
      for (let i = 0; i < Object.values(userlist).length; i++) {
        if (Object.values(userlist)[i].nickname == data.nickname) {
          socket.emit("LoginResult", { result: "disapproval" });
          return;
        }
      }
      socket.emit("LoginResult", { result: "approval" });
      socket.join("testroom");
      if (Object.keys(userlist).length <= 1) {
        io.to("testroom").emit("endGame", {});
      }

      io.to("testroom").emit("wordList", { list: list });
      userlist[socket.id] = { nickname: data.nickname };
      io.to("testroom").emit("userList", { userlist: Object.values(userlist) });
    });

    socket.on("userList", () => {
      socket.emit("userList", { userlist: Object.values(userlist) });
    });
    socket.on("disconnect", () => {
      if (socket.id in userlist) {
        let a = userlist[socket.id].nickname;
        delete userlist[socket.id];
        if (Object.keys(userlist).length <= 1) {
          io.to("testroom").emit("endGame", {});
        }
        io.to("testroom").emit("escapeUser", {
          userlist: Object.values(userlist),
          runuser: a,
        });
      } else {
        console.log("헐");
      }
      console.log(socket.id + "끊김");
    });
  });
};
