import React from "react";
import ReactDOM from "react-dom/client";
import router from "./router";
import { RouterProvider } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store";
import "./assets/reset.css";
import "./assets/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <Provider store={store}>
  <RouterProvider router={router} />
  // </Provider>
);
