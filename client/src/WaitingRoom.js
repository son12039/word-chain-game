import { useSocket } from "./SocketContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./components/Modal";
const WaitingRoom = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    if (sessionStorage.getItem("nickname") == null) {
      fetchUserInfo();
    } else {
      setNickname(sessionStorage.getItem("nickname"));
    }
    if (socket) {
      socket.on("connect", () => {
        console.log("서버에 연결되었습니다. Socket ID:", socket.id);
      });

      socket.on("end", (data) => {
        console.log("어라");
        setUserList(data.userList);
      });
      socket.on("userList", (data) => {
        setUserList(data.userlist);
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
    if (socket) {
      console.log("요청");
      socket.emit("end", () => {});
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
      sessionStorage.setItem("nickname", result.userInfo);
    }
  };
  const start = () => {
    socket.emit("start", { nickname });
  };
  return (
    <>
      <div>현재 : {userList.length} 접속중</div>
      <button onClick={start} disabled={isReady}>
        시작하기!(최소2인이상)
      </button>
      {userList?.length > 0 != 0 ? (
        userList.map((item, index) => <div key={index}>{item.nickname}</div>)
      ) : (
        <></>
      )}
    </>
  );
};

export default WaitingRoom;
