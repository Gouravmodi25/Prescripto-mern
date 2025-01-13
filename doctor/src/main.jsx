import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import DoctorContextProvider from "./context/DoctorContext.jsx";
import AppContextProvider from "../../admin/src/context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <DoctorContextProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </DoctorContextProvider>
  </>
);
