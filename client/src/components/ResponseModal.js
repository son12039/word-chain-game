import Swal from "sweetalert2";
const ResponseModal = async (data) => {
  await Swal.fire({
    text: data ? "로그인성공" : "이미 접속중인 아이디입니다",
    icon: data ? "success" : "warning",
    confirmButtonText: "확인",
    position: "center",
  });
};
export default ResponseModal;
