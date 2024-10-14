import React, { useState } from "react";
import { keywordCheck } from "../api/keywordCheck";

const Submit = ({
  userInput,
  setDesc,
  setKeywordList,
  setUserInput,
  nickname,
}) => {
  const [word, setWord] = useState("시작할 단어 입력");

  const onSubmit = async (e) => {
    e.preventDefault();
    // 2글자이상,한글만,사전에 있는 단어만
    const koreanRegex = /^[가-힣]{2,}$/;
    try {
      const re = await keywordCheck(word);
      console.log(re);
      // setDesc(re);
    } catch {
      setDesc("없는 단어에요");
    }

    if (word !== "시작할 단어 입력") {
      if (userInput[0] === word[word.length - 1]) {
        setKeywordList((prevList) => [
          ...prevList,
          { nick: nickname, keyword: userInput },
        ]);
        setWord(userInput);
        setUserInput("");
      } else {
        setUserInput("");
      }
    } else {
      setKeywordList((prevList) => [
        ...prevList,
        { nick: nickname, keyword: userInput + "(시작단어)" },
      ]);
      setWord(userInput);
      setUserInput("");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        onChange={(e) => setUserInput(e.target.value)}
        value={userInput}
      />
      <button type="submit">확인</button>
    </form>
  );
};

export default Submit;
