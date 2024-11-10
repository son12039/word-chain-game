import React from "react";
import ReactDOM from "react-dom/client";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import { SocketProvider } from "./SocketContext";
import "./assets/reset.css";
// import "./assets/index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SocketProvider>
    <RouterProvider router={router} />
  </SocketProvider>
);
