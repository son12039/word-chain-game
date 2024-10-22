import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Modal from "./components/Modal";
import { user } from "./api/memberAPI";
const Socket = () => {
  const serverURL = "http://localhost:3001";
  const [socket, setSocket] = useState(null);
  const [list, setList] = useState([]);
  const [nickname, setNickname] = useState("");
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
    const login = await Modal();
    user(login);
    console.log(nickname);
    setNickname(nickname);
  };
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
      <h1>안녕</h1>
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
