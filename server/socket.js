import { Server } from "socket.io";
import { wordCheck } from "./wordAPI.js";
export const createSocket = (server) => {
  let wordList = [];
  let userList = new Map();
  let talkList = [];
  let gameState = false;
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
    // 접속
    console.log(socket.id + "연결");
    // 입장
    socket.on("accessRequest", (nickname) => {
      console.log(nickname, "입장");
      if (!userList.has(nickname)) {
        userList.set(nickname, socket.id);
        socket.join("permission");
        socket.emit("accessResult", {
          result: nickname,
          talkList: Array.from(talkList),
          gameState: gameState,
        });
        console.log("성공");
        io.to("permission").emit("UserFlow", Array.from(userList.keys()));
      } else {
        console.log("실패");
        socket.emit("accessResult", { result: null });
      }
    });
    // 재입장
    socket.on("reconnect", (nickname) => {
      if (!userList.has(nickname)) {
        const a = userList.set(nickname, socket.id);
        socket.join("permission");
        socket.emit("accessResult", {
          result: nickname,
          talkList: Array.from(talkList),
          gameState: gameState,
          reconnect: "reconnect",
        });
        io.to("permission").emit("UserFlow", Array.from(userList.keys()));
        socket.emit("test", nickname);
      }
    });
    // 채팅
    socket.on("msgSubmit", (data) => {
      console.log(data);
      talkList.push(data);
      io.to("permission").emit("msgSubmit", Array.from(talkList));
    });
    socket.on("talkList", () => {
      Array.from(talkList);
    });
    // 게임
    socket.on("start", (nickname) => {
      io.to("permission").emit("start", nickname);
      gameState = true;
    });
    socket.on("userList", () => {
      io.to("permission").emit("userList", {
        userList: Array.from(userList.keys()),
      });
    });
    const wordTest = async (data) => {
      const a = await wordCheck(data.word);
    };
    socket.on("word", (data) => {
      if (data) {
        wordList.unshift(data);
        io.to("permission").emit("word", data);
      } else {
        socket.emit("wordList", Object.values(wordList));
      }
    });
    socket.on("end", (data) => {
      io.to("permission").emit("end", data);
      gameState = false;
      console.log(gameState);
    });
    // 이탈
    socket.on("disconnect", () => {
      for (let [nickname, id] of userList.entries()) {
        if (id === socket.id) {
          userList.delete(nickname);
          console.log(nickname, "종료");
          io.to("permission").emit("UserFlow", Array.from(userList.keys()));
          break;
        }
      }
    });
  });
};

/*  
const reset = () => {
    list.clear();
    io.to("testroom").emit("wordList", { list: Array.from(list.values()) });
    previousWord = "";
  };


socket.on("started", () => {
      console.log("엥");
      socket.emit("started", { started });
    });

    socket.on("word", async (word) => {
      if (list.has(word.msg)) {
        reset();
        io.to("testroom").emit("overlapWord", {
          overlapWord: word.nickname,
        });
      } else {
        const definitions = await wordCheck(word.msg);
        if (definitions) {
          if (word.msg.charAt(0) == previousWord || previousWord == "") {
            previousWord = word.msg.charAt(word.msg.length - 1);
            list.set(word.msg, word);
            io.to("testroom").emit("wordAdd", {
              word,
              definitions,
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
      for (let user of Object.values(userlist)) {
        if (user.nickname === data.nickname) {
          socket.emit("LoginResult", { result: "disapproval" });
          return;
        }
      }
      socket.emit("LoginResult", { result: "approval" });
      socket.join("testroom");
      if (Object.keys(userlist).length <= 1) {
        io.to("testroom").emit("endGame", {});
      }

      io.to("testroom").emit("wordList", { list: Array.from(list.values()) });
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
    }); */
