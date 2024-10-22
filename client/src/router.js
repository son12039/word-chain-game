import { createBrowserRouter } from "react-router-dom";
import Submit from "./components/Submit";
import Socket from "./Socket";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Socket />,
  },
]);

export default router;
