import axios from "axios";

export const test = async (keyword) => {
  const instance = axios.create({
    baseURL:
      "https://krdict.korean.go.kr/api/search?key=6C1D885801288B0665515B50BC8DBCCA&type_search=search&part=word&q=" +
      encodeURIComponent(keyword),
  });
  const response = await instance.get();
  const xmlData = response.data;

  // XML 파싱
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, "text/xml");
  const items = xmlDoc.getElementsByTagName("item");

  const word = items[0].getElementsByTagName("word")[0].textContent;
  const definition = items[0].getElementsByTagName("definition")[0].textContent;

  const resultString = `${word} : ${definition}`;

  return resultString;
};
