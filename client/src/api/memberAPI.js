import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/member",
});

export const user = async (data) => {
  const result = await instance.post("user", data);
  return result.data.nickname;
};
export const point = async (data) => {
  const result = await instance.post("point", data);
  return result.status;
};
