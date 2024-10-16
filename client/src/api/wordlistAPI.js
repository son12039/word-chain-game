import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:3000/",
})


export const getWordlist = async () => {
    try {
        const response = await instance.get('list');
        return response.data; // 조회된 데이터 반환
    } catch (error) {
        console.error('단어 목록 조회 오류:', error);
        throw error; // 오류 발생 시 예외를 발생시킴
    }
};
export const addWord = async (data) => {
    try {
        await instance.post('add',data);
    } catch (error) {
        console.error('단어 추가 오류:', error);
        throw error; // 오류 발생 시 예외를 발생시킴
    }
};