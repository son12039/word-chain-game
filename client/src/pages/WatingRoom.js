import { useSocket } from "../SocketContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponseModal from "../components/ResponseModal";
import Modal from "../components/Modal";
import GameModal from "../components/GameModal";
import "../assets/WaitingRoom.css";
const WaitingRoom = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [userList, setUserList] = useState([]);
  const [talk, setTalk] = useState("");
  const [talkList, setTalkList] = useState([]);
  const fetchUserInfo = async () => {
    const nickname = await Modal();
    setNickname(nickname?.userInfo);
  };
  const logout = () => {
    window.location.reload();
    sessionStorage.removeItem("nickname");
  };
  const start = () => {
    socket.emit("start", nickname);
  };
  const enter = (e) => {
    if (e.key === "Enter" && talk.trim().length >= 1) {
      msgSubmit();
    }
  };
  const msgSubmit = () => {
    if (talk.trim().length >= 1) {
      console.log(nickname, talk);
      socket.emit("msgSubmit", { nickname, talk });
      setTalk("");
    }
  };
  const response = async (data) => {
    await ResponseModal(data);
    if (!data) await fetchUserInfo();
  };
  useEffect(() => {
    if (socket) {
      const nickname = sessionStorage.getItem("nickname");
      if (nickname) {
        socket.emit("reconnect", nickname);
        setNickname(nickname);
      } else {
        fetchUserInfo();
      }

      //로그인요청, 결과에 따른 로직
      socket.on("accessResult", (data) => {
        if (data.reconnect == "reconnect") {
          setTalkList(data.talkList);
        } else if (data.result) {
          response(data.result);
          sessionStorage.setItem("nickname", data.result);
          setTalkList(data.talkList);
        } else {
          setNickname("");
          response(false);
          return;
        }
        if (data.gameState) {
          console.log("내가 원하는곳");
          GameModal(true);
          navigate("/game");
        }
      });
      socket.on("reconnect", () => {
        response(false);
      });
      socket.on("UserFlow", (data) => {
        setUserList(data);
      });
      socket.on("msgSubmit", (data) => {
        setTalkList(data);
      });
      socket.on("start", (nickname) => {
        console.log("내가 원치않는곳");
        GameModal(nickname);
        navigate("/game");
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket && nickname && !sessionStorage.getItem("nickname")) {
      socket.emit("accessRequest", nickname);
    }
  }, [nickname]);

  return (
    <>
      <div>본인: {sessionStorage.getItem("nickname")}</div>
      {userList.map((nickname, index) => {
        return <div key={index}>{nickname}</div>;
      })}
      <div>{userList.length}명</div>
      <button onClick={logout}>재로그인하기</button>
      <div>대기실입니당</div>
      <input
        value={talk}
        onKeyDown={enter}
        onChange={(e) => {
          setTalk(e.target.value);
        }}
      />
      <button onClick={msgSubmit}>발송</button>
      <button onClick={start}>시작하기</button>
      {talkList.map((msg, index) => {
        return (
          <div key={index}>
            {msg.nickname} : {msg.talk}
          </div>
        );
      })}
    </>
  );
};

export default WaitingRoom;
