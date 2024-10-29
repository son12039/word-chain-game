import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/member",
});

export const user = async (data) => {
  const result = await instance.post("user", data);
  console.log(result);
  return result.data.nickname;
};
