import { useSocket } from "./SocketContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "./components/Modal";
// import "./assets/WaitingRoom.css";
const WaitingRoom = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [nickname, setNickname] = useState("");
  const location = useLocation();
  const state = location?.state;
  useEffect(() => {
    if (
      sessionStorage.getItem("nickname") == null ||
      sessionStorage.getItem("nickname") == ""
    ) {
      sessionStorage.removeItem("nickname");
      fetchUserInfo();
    } else {
      setNickname(sessionStorage.getItem("nickname"));
    }
    if (socket) {
      socket.emit("userList", () => {});
      socket.on("connect", () => {
        console.log("서버에 연결되었습니다. Socket ID:", socket.id);
      });
      socket.on("end", (data) => {
        setUserList(data.userList);
      });
      socket.on("LoginResult", (data) => {
        console.log(nickname);
        if (data.result == "approval") {
          console.log(nickname + "  성공");
        } else {
          console.log("실패");
          sessionStorage.removeItem("nickname");
          setNickname("");
          alert("이미 접속중인 아이디입니다");
          fetchUserInfo();
        }
      });
      socket.on("userList", (data) => {
        setUserList(data.userlist);
        console.log(data.userlist);
      });
      socket.on("start", (data) => {
        navigate("/game", { state: { startUser: data.startUser } });
      });
      socket.on("escapeUser", (data) => {
        setUserList(data.userlist);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (nickname !== "") {
      sessionStorage.setItem("nickname", nickname);
    }
  }, [nickname]);

  const [isReady, setIsReady] = useState(true);
  useEffect(() => {
    setIsReady(userList.length < 2);
  }, [userList]);

  const fetchUserInfo = async () => {
    const result = await Modal();
    if (result) {
      setNickname(result.userInfo);
    }
  };
  useEffect(() => {
    if (nickname) {
      console.log("중복체크", nickname);
      socket.emit("enter", { nickname });
    }
  }, [nickname]);
  const start = () => {
    socket.emit("start", { nickname });
  };
  return (
    <>
      <div className="back">
        <div className="waiting-room">
          <h1>대기실</h1>
          {/* <div>{state}</div> */}
          <div className="status">
            <p>현재 접속중: {userList.length}</p>
          </div>
          <button className="start-button" onClick={start} disabled={isReady}>
            시작하기! (최소 2인이상 최대 5인)
          </button>
          <div className="user-list">
            {userList.length > 0 ? (
              userList.map((item, index) => (
                <div key={index} className="user-item">
                  {item.nickname}
                </div>
              ))
            ) : (
              <p>현재 접속중인 사용자가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WaitingRoom;
