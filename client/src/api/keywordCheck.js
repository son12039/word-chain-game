import axios from "axios";

const parseXML = (xmlData) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, "text/xml");
  const items = xmlDoc.getElementsByTagName("item");
  if (items.length > 0) {
    const word = items[0].getElementsByTagName("word")[0].textContent;
    const definition =
      items[0].getElementsByTagName("definition")[0].textContent;
    return { word, definition };
  } else {
    return null;
  }
};

export const keywordCheck = async (keyword) => {
  const response = await axios.get(
    `https://krdict.korean.go.kr/api/search?key=6C1D885801288B0665515B50BC8DBCCA&type_search=search&part=word&q=${encodeURIComponent(
      keyword
    )}`
  );
  const { word, definition } = parseXML(response.data);
  return { word, definition };
};
