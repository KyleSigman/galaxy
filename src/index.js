import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import { AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <App />
</React.StrictMode>
);

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <AuthContextProvider>
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   </AuthContextProvider>
// );


// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { AuthContextProvider } from "./context/AuthContext";
// import { ChatContextProvider } from "./context/ChatContext";

// import 'react-toastify/dist/ReactToastify.css';

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <AuthContextProvider>
//     <ChatContextProvider>
//       <React.StrictMode>
//         <App />
//       </React.StrictMode>
//     </ChatContextProvider>
//   </AuthContextProvider>
// );