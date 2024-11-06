import React, { useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useNavigate } from "react-router-dom";
import { point as changePoint } from "./api/memberAPI";
import "./assets/index.css";
const Socket = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [nickname, setNickname] = useState("");
  const [definitions, setDefinitions] = useState([]);
  const [userList, setUserList] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    setNickname(sessionStorage.getItem("nickname"));
    if (socket) {
      socket.emit("userList");
      socket.on("wordList", (List) => {
        setList(List.list);
      });
      socket.on("endGame", () => {
        navigate("/", {
          state: { msg: "혼자 남았습니다" },
        });
      });
      socket.on("wordAdd", (data) => {
        setList((prev) => [data.word, ...prev]);
        setDefinitions(data.definitions);
      });
      socket.on("userList", (data) => {
        setUserList(data.userlist);
      });
      socket.on("escapeUser", (data) => {
        setUserList(data.userlist);
      });
      socket.on("wrongWord", (data) => {
        point();
        navigate("/", { state: { msg: data.wrong + "가 잘못된 단어 입력" } });
      });
      socket.on("overlapWord", (data) => {
        navigate("/", {
          state: { msg: data.overlapWord + "가 중복단어 입력" },
        });
      });
      socket.on("unlikeWord", (data) => {
        point();
        navigate("/", {
          state: { msg: data.unlike + "가 안 이어지는 단어 입력" },
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (nickname) {
      // socket.emit("enter", { nickname });
    }
  }, [nickname]);

  const point = async () => {
    const point = 3;
    await changePoint({ nickname, point });
  };

  const [val, setVal] = useState("");
  const onClick = () => {
    socket.emit("word", { msg: val, nickname: nickname });
    setVal("");
  };
  const input = (e) => {
    setVal(e.target.value);
    if (e.key === "Enter" && val.length >= 2) onClick();
  };

  return (
    <div className="game">
      <h1 className="Title">온라인끝말잇기게임</h1>
      <h1>{nickname ? `${nickname}님` : ""}</h1>
      <button onClick={onClick} disabled={val.length < 2}>
        보내기
      </button>
      <input
        onKeyDown={input}
        onChange={(e) => setVal(e.target.value.trim())}
        value={val}
        placeholder="2글자이상입력"
      />

      {list.length > 0 && (
        <div>
          <p>{list[0].msg}</p>
        </div>
      )}

      <ul>
        {list.length > 0 &&
          list.map((item, index) =>
            item ? (
              <li key={index}>{item.nickname + " : " + item.msg}</li>
            ) : null
          )}
      </ul>
      <div className="user-list">
        {userList.length > 0 &&
          userList.map((item, index) => (
            <div key={index} className="user-item">
              {item.nickname}
            </div>
          ))}
      </div>
      <div className="definitions">
        {definitions.length > 0 &&
          definitions.map((item, index) => (
            <div key={index} className="definition">
              {item}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Socket;
