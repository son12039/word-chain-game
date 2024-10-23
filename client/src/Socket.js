import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Modal from "./components/Modal";
import { user } from "./api/memberAPI";
const Socket = () => {
  const serverURL = "http://localhost:3001";
  const [socket, setSocket] = useState(null);
  const [list, setList] = useState([]);
  const [nickname, setNickname] = useState("");
  const [text, setText] = useState("로그인 또는 회원가입");
  useEffect(() => {
    const socket = io(serverURL);
    setSocket(socket);
    socket.on("connect", () => {
      console.log("서버에 연결되었습니다. Socket ID:", socket.id);
    });
    socket.on("wordlist", (List) => {
      setList(List.list);
    });
    fetchUserInfo();
    return () => {
      socket.disconnect();
    };
  }, []);
  const fetchUserInfo = async () => {
    const login = await Modal(text);
    const a = await user(login);
    console.log("어라?" + a);
    if (a == "실패") {
      // setText("이미 존재하는 아이디입니다");

      return;
    }
    setNickname(a);
  };
  useEffect(() => {
    if (text) {
      Modal(text);
    }
  }, [text]);

  useEffect(() => {
    console.log(nickname);
  }, [nickname]);
  const [val, setVal] = useState("");
  const onClick = () => {
    socket.emit("word", { msg: val, nickname: nickname });
    setVal("");
  };
  const input = (e) => {
    setVal(e.target.value);
    if (e.key === "Enter") onClick();
  };

  return (
    <div>
      <h1 className="Title">온라인끝말잇기게임</h1>
      <h1>{nickname != "" ? nickname + "님" : ""}</h1>
      <button onClick={onClick}>보내기</button>
      <input
        onKeyDown={input}
        onChange={(e) => setVal(e.target.value)}
        value={val}
      ></input>
      <ul>
        {list.length > 0 != 0 ? (
          list.map(
            (item, index) =>
              item && <li key={index}>{item.nickname + " : " + item.msg}</li>
          )
        ) : (
          <li></li>
        )}
      </ul>
    </div>
  );
};

export default Socket;
