import React, { useState, useEffect } from "react";
import { useSocket } from "../SocketContext";
import { useNavigate } from "react-router-dom";
import "../assets/GameRoom.css";
const GameRoom = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [word, setWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [nickname, setNickname] = useState("");
  const [userList, setUserList] = useState([]);
  const end = () => {
    socket.emit("end");
  };
  const wordSubmit = () => {
    if (word.trim().length >= 1) {
      socket.emit("word", { nickname, word });
      setWord("");
    }
  };
  const enter = (e) => {
    if (e.key === "Enter" && word.trim().length >= 1) {
      wordSubmit();
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1500);
    if (socket) {
      // 입장
      const nickname = sessionStorage.getItem("nickname");
      if (nickname) {
        socket.emit("reconnect", nickname);
        socket.emit("word", null);
        socket.on("test", () => {
          setShow(true);
        });
        socket.emit("userList");
        socket.on("userList", (data) => {
          setUserList(data.userList);
        });
        setNickname(nickname);
      } else {
        navigate("/");
      }
      // 게임로직등록
      socket.on("wordList", (list) => {
        setWordList(list);
      });
      socket.on("word", (data) => {
        setWordList((prevList) => [data, ...prevList]);
      });
      socket.on("end", () => {
        navigate("/");
      });
    }
    return () => clearTimeout(timer);
  }, [socket]);

  return (
    <>
      <div className="game">
        {show ? (
          <>
            <button onClick={wordSubmit}>보내기</button>
            <input
              placeholder="2글자이상입력"
              value={word}
              onKeyDown={enter}
              onChange={
                (e) => {
                  setWord(e.target.value);
                }

                // onkeydown(Enter)
              }
            />
            <button onClick={end}>끝내장</button>
            <div className="user-list">
              {userList.length > 0 &&
                userList.map((item, index) => (
                  <div key={index} className="user-item">
                    {item}
                  </div>
                ))}
            </div>
            {wordList.map((item, index) => (
              <div key={index}>
                {item.nickname} : {item.word}
              </div>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
};

export default GameRoom;
