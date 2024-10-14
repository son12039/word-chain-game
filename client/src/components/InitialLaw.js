export const splitHangul = (char) => {
  // 한글 유니코드 시작값
  const BASE_CODE = 44032;
  const CHOSUNG_COUNT = 19; // 초성의 개수
  const JUNGSUNG_COUNT = 21; // 중성의 개수
  const JONGSUNG_COUNT = 28; // 종성의 개수

  const code = char.charCodeAt(0) - BASE_CODE;

  if (code < 0 || code > 11171) {
    throw new Error("유효한 한글 음절이 아닙니다.");
  }

  const jong = code % JONGSUNG_COUNT; // 종성 인덱스
  const jung = Math.floor(
    (code % (CHOSUNG_COUNT * JUNGSUNG_COUNT)) / JONGSUNG_COUNT
  ); // 중성 인덱스
  const cho = Math.floor(code / (CHOSUNG_COUNT * JUNGSUNG_COUNT)); // 초성 인덱스

  // 초성, 중성, 종성 배열
  const chosungList = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  const jungsungList = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];

  const jongsungList = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  return {
    초성: chosungList[cho],
    중성: jungsungList[jung],
    종성: jongsungList[jong],
  };
};

// 사용 예시
