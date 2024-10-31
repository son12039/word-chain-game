import axios from "axios";

export const wordCheck = async (word) => {
  const response = await axios.get(
    `https://stdict.korean.go.kr/api/search.do?certkey_no=7020&key=2B4D26E8AC49B7D1150F0F2185C8D33D&type_search=search&req_type=json&advanced=y&q=${encodeURIComponent(
      word
    )}&pos=1`
  );
  try {
    const result = response.data.channel.item;
    let definitions = [];
    for (let i = 0; result.length > i && i < 3; i++) {
      definitions.push(result[i].sense.definition);
    }
    return definitions;
  } catch (error) {
    return null;
  }
};
