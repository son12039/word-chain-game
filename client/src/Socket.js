import React, { useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useLocation, useNavigate } from "react-router-dom";
import { point as changePoint } from "./api/memberAPI";
const Socket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [nickname, setNickname] = useState("");
  const [lastText, setLastText] = useState("온라인끝말잇기게임");
  const [definitions, setDefinitions] = useState([]);
  const [userList, setUserList] = useState([]);
  const socket = useSocket();
  useEffect(() => {
    setNickname(sessionStorage.getItem("nickname"));
    // if (getNickname == "") {
    //   navigate("/");
    // }
    if (socket) {
      socket.on("wordList", (List) => {
        console.log(List);
        setList(List.list);
      });
      socket.on("late", () => {
        console.log("이미 시작함");
      });
      socket.on("wordAdd", (data) => {
        setList((prev) => [...prev, data.word]);
        setDefinitions(data.definitions);
      });
      socket.on("userList", (data) => {
        setUserList(data.userlist);
      });
      socket.on("escapeUser", (data) => {
        setUserList(data.userlist);
        setLastText(data.runuser + "가 호다닥 도망ㅋㅋㅋ");
        navigate("/");
      });
      socket.on("wrongWord", (data) => {
        point();
        setLastText(data.wrong + "가 잘못된 단어 입력ㅋㅋㅋ");
        navigate("/");
      });
      socket.on("overlapWord", (data) => {
        setLastText(data.overlapWord + "가 중복단어 입력ㅋㅋㅋ");
        navigate("/");
      });
      socket.on("unlikeWord", (data) => {
        point();
        setLastText(data.unlike + "가 안 이어지는 단어 입력ㅋㅋㅋ");
        navigate("/");
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);

  useEffect(() => {
    if (nickname) {
      socket.emit("enter", { nickname });
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
    if (e.key === "Enter") onClick();
  };

  return (
    <div>
      <h1 className="Title">{lastText}</h1>
      <h1>{nickname != "" ? nickname + "님" : ""}</h1>
      <button onClick={onClick}>보내기</button>
      <input
        onKeyDown={input}
        onChange={(e) => setVal(e.target.value.trim())}
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
      {userList?.length > 0 != 0 ? (
        userList.map((item, index) => <div key={index}>{item.nickname}</div>)
      ) : (
        <></>
      )}
      <div className="definitions">
        {definitions?.length > 0 != 0 ? (
          definitions.map((item, index) => (
            <div key={index} className="definition">
              {item}
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Socket;
