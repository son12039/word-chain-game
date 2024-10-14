// Modal.js
import Swal from "sweetalert2";

const Modal = async () => {
  const { value: nickname } = await Swal.fire({
    title: "닉네임 입력해주세요(필수)",
    icon: "question",
    input: "text",
    allowOutsideClick: false,
    confirmButtonText: "확인",
    inputValidator: (value) => {
      if (!value || value.trim() === "") {
        return "닉네임을 입력해주세요!";
      }
    },
  });
  return nickname;
};

export default Modal;
