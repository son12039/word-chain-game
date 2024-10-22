// Modal.js
import Swal from "sweetalert2";

const Modal = async () => {
  const { value: formValues } = await Swal.fire({
    title: "로그인 또는 회원가입",
    html: `
      <input id="swal-input-id" class="swal2-input custom-input" placeholder="ID(6~12자 영문자,숫자)" autocomplete="off">
      <input type="password" id="swal-input-password" class="swal2-input custom-input" placeholder="PWD(8~14자 영문자,숫자)" autocomplete="off">
      <input type="text" id="swal-input-nickname" class="swal2-input custom-input" placeholder="닉네임(4자이하 회원가입 시에만)" autocomplete="off">
    `,
    focusConfirm: false,
    confirmButtonText: "확인",
    allowOutsideClick: false,
    preConfirm: () => {
      const id = document.getElementById("swal-input-id").value;
      const password = document.getElementById("swal-input-password").value;
      const nickname = document.getElementById("swal-input-nickname").value;
      if (!id || id.trim() === "") {
        Swal.showValidationMessage("아이디를 입력해주세요!");
        return false;
      }
      if (!password || password.trim() === "") {
        Swal.showValidationMessage("비밀번호를 입력해주세요!");
        return false;
      }

      return { id, password, nickname };
    },
    customClass: {
      popup: "custom-popup",
    },
  });

  return formValues; // 입력값 반환
};
const style = document.createElement("style");
style.innerHTML = `
  .custom-popup {
    width: 600px;
    max-width: 100%;

    input {
      width: 70%;
      max-width: 100%;
      color: white;

      &:focus {
        box-shadow : none;
        border-color: hsl(0, 0%, 85%)
      }
    }
  }
  
  .swal2-popup.swal2-modal.custom-popup.swal2-show {
    background-color: rgb(30,26, 26); 
  }
    #swal2-title {
    color: white;
    }
`;
document.head.appendChild(style);
export default Modal;
