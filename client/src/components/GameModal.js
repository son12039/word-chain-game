import Swal from "sweetalert2";

const GameModal = async (nickname) => {
  await Swal.fire({
    title:
      nickname != true
        ? `<span style="color: #333;">${nickname}님이 게임스타트!</span>`
        : `<span style="color: #333;">진행중인 방에 입장합니다</span>`,
    text: "잠시 후 시작합니다",
    icon: "info",
    confirmButtonText: false,
    position: "center",
    showConfirmButton: false,
    allowEscapeKey: false,
    timer: 1500,
    timerProgressBar: true,
    allowOutsideClick: false,
  });
};
export default GameModal;
