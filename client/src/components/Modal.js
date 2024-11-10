import Swal from "sweetalert2";
import { user } from "../api/memberAPI";

const Modal = async () => {
  const { value: formValues } = await Swal.fire({
    title: "로그인 혹은 회원가입",
    html: `
      <input id="swal-input-id" class="swal2-input custom-input" placeholder="ID(6~12자 영문자,숫자)"
      value = "qweqwe123" autocomplete="off">
      <input type="password" id="swal-input-password" 
      value = "qweqwe123"
      class="swal2-input custom-input" placeholder="PWD(8~14자 영문자,숫자)" autocomplete="off">
      <input type="text" id="swal-input-nickname" class="swal2-input custom-input" placeholder="닉네임(한글2~4자 회원가입 시에만)" autocomplete="off">
    `,
    focusConfirm: false,
    confirmButtonText: "확인",
    allowOutsideClick: false,
    allowEscapeKey: false,
    preConfirm: async () => {
      const id = document.getElementById("swal-input-id").value;
      const password = document.getElementById("swal-input-password").value;
      let nickname = document.getElementById("swal-input-nickname").value;

      const idRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/;
      if (!idRegex.test(id)) {
        Swal.showValidationMessage(
          "아이디는 영문자, 숫자 각각 1개이상포함 6~12자만 입력 가능합니다."
        );
        return false;
      }

      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,14}$/;
      if (!passwordRegex.test(password)) {
        Swal.showValidationMessage(
          "비밀번호는 영문자, 숫자 각각 1개이상포함 8~14자만 입력 가능합니다."
        );

        return false;
      }

      const nicknameRegex = /^[가-힣]{2,4}$/;
      if (!nicknameRegex.test(nickname) && nickname != "") {
        Swal.showValidationMessage("닉네임은 2~4자 한글만 입력 가능합니다.");
        document.getElementById("swal-input-nickname").value = "";
        return false;
      }

      const userInfo = await user({ id, password, nickname });
      if (userInfo === "로그인 실패") {
        Swal.showValidationMessage("잘못된 로그인 정보이거나,없는 계정입니다.");
        return false;
      } else if (userInfo === undefined) {
        Swal.showValidationMessage("존재하는 아이디입니다");
        return false;
      }

      return { userInfo };
    },
    customClass: {
      popup: "custom-popup",
    },
    willOpen: () => {
      const inputElements = document.querySelectorAll(".swal2-input");
      inputElements.forEach((input) => {
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            Swal.clickConfirm();
          }
        });
      });
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
