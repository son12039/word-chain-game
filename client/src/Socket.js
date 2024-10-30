import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Modal from "./components/Modal";
const Socket = () => {
  const serverURL = "http://localhost:3001";
  const [socket, setSocket] = useState(null);
  const [list, setList] = useState([]);
  const [nickname, setNickname] = useState("");
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const socket = io(serverURL);
    setSocket(socket);
    socket.on("connect", () => {
      console.log("서버에 연결되었습니다. Socket ID:", socket.id);
    });

    socket.on("wordlist", (List) => {
      setList(List.list);
    });
    socket.on("test", (data) => {
      console.log(data.msg);
    });
    socket.on("userlist", (data) => {
      setUserList(data.userlist);
    });

    fetchUserInfo();
    return () => {
      socket.disconnect();
    };
  }, []);
  const fetchUserInfo = async () => {
    const a = await Modal();
    if (a) setNickname(a.userInfo);
  };

  useEffect(() => {
    if (nickname) {
      socket.emit("enter", { nickname });
    }
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
          <></>
        )}
      </ul>
      {userList.length > 0 != 0 ? (
        userList.map((item, index) => <div key={index}>{item.nickname}</div>)
      ) : (
        <></>
      )}
    </div>
  );
};

export default Socket;
