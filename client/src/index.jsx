import "./index.less";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./reducers";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./components/App";
import Main from "./components/main/Main";
import Wb from "./components/wb/Wb";
import ErrorPage from "./error-page";
import WbFbs from "./components/wb/wbfbs/wbfbs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Main />,
      },
      {
        path: "wb",
        element: <Wb />,
        children: [
          {
            path: "fbs",
            element: <WbFbs />,
          },
        ],
      },
    ],
  }
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App tab="home" />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
