import React, { useState, useEffect } from "react";
import { keywordCheck } from "../api/keywordCheck";
import Modal from "./Modal";
const Submit = () => {
  const [nickname, setNickname] = useState("");
  const [userInput, setUserInput] = useState("");
  const [desc, setDesc] = useState("");
  const [keywordList, setKeywordList] = useState([]);
  const [word, setWord] = useState("시작할 단어 입력");
  //////////////////////////
  const inputNick = async () => {
    setNickname(await Modal());
  };
  useEffect(() => {
    inputNick();
  }, []);
  //////////////////////////

  //////////////////////

  const keyCheck = async (keyword) => {
    try {
      const re = await keywordCheck(keyword);
      if (re.word != "")
        //여기에 제약조건추가
        setDesc(re.word + " : " + re.definition);
      setWord(re.word);
      setKeywordList((prevList) => [
        ...prevList,
        { nick: nickname, keyword: re.word },
      ]);
    } catch {
      setDesc("없는 단어에요");
    }

    setUserInput("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    keyCheck(userInput);
  };

  return (
    <>
      <h2>{nickname != "" ? nickname + " : " + word : word}</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
        />
        <button type="submit">확인</button>
        <p>{desc}</p>
        <div>동사,형용사,영단어 안 돼요</div>
        <div>본 게임은 한국어기초사전을 기반으로 제작되었습니다.</div>
      </form>
      <ul>
        {keywordList?.map((item, index) => (
          <li key={index}>{item.nick + " : " + item.keyword}</li>
        ))}
      </ul>
    </>
  );
};

export default Submit;

// const koreanRegex = /^[가-힣]{2,}$/;
//     keyCheck();
//     if (word !== "시작할 단어 입력") {
//       if (userInput[0] === word[word.length - 1]) {
//         setKeywordList((prevList) => [
//           ...prevList,
//           { nick: nickname, keyword: userInput },
//         ]);
//         setWord(userInput);
//         setUserInput("");
//       } else {
//         setUserInput("");
//       }
//     } else {
//       setKeywordList((prevList) => [
//         ...prevList,
//         { nick: nickname, keyword: userInput + "(시작단어)" },
//       ]);
//       setWord(userInput);
//       setUserInput("");
//     }
