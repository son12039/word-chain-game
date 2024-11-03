import { createBrowserRouter } from "react-router-dom";
import Socket from "./Socket";
import WaitingRoom from "./WaitingRoom";
const router = createBrowserRouter([
  {
    path: "/game",
    element: <Socket />,
  },
  {
    path: "/",
    element: <WaitingRoom />,
  },
]);

export default router;
