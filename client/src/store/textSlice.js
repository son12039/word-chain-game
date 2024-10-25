import { createSlice } from "@reduxjs/toolkit";

// createSlice로 리듀서 정의
const textSlice = createSlice({
  name: "text", // 슬라이스명
  initialState: { text: "로그인 또는 회원가입" }, // 초기 상태
  reducers: {
    initial: (state) => {
      state.text = "로그인 또는 회원가입";
    },
    alter: (state) => {
      state.text = "이미 존재하는 아이디입니다";
    },
  },
});

// 액션 내보내기
export const { initial, alter } = textSlice.actions;

export default textSlice;
