import { useRef, useState, useEffect } from "react";
import Modal from "./components/Modal";
import Submit from "./components/Submit";
const App = () => {
  const [word, setWord] = useState("시작할 단어 입력");
  const [userInput, setUserInput] = useState("");
  const [desc, setDesc] = useState("");
  const [nickname, setNickname] = useState("");
  const [keywordList, setKeywordList] = useState([]);
  // 상태관리

  const inputNick = async () => {
    setNickname(await Modal());
  };
  useEffect(() => {
    inputNick();
  }, []);
  // 시작

  // 중간부분

  return (
    <div>
      <h2>{nickname != "" ? nickname + " : " + word : word}</h2>
      <Submit
        word={word}
        userInput={userInput}
        setDesc={setDesc} // setDesc를 올바르게 전달
        setKeywordList={setKeywordList}
        setWord={setWord}
        setUserInput={setUserInput}
        nickname={nickname}
      />

      {<div> {desc}</div>}
      <div>동사,형용사,영단어 안 돼요</div>
      <div>본 게임은 한국어기초사전을 기반으로 제작되었습니다.</div>
      <ul>
        {keywordList?.map((keyword, index) => (
          <li key={index}>{keyword.nick + " : " + keyword.keyword}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
