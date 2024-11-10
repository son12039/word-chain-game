import { createBrowserRouter } from "react-router-dom";
import GameRoom from "./pages/GameRoom";
import WaitingRoom from "./pages/WatingRoom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <WaitingRoom />,
  },
  {
    path: "/game",
    element: <GameRoom />,
  },
]);

export default router;
