import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { store, persistor } from "./store/store.ts";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
