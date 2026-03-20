import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./pages/style.scss";
import "./pages/profile.scss";
import "./pages/finder.scss";
import "./pages/posts.scss";
import "./pages/webkit.scss";
import "./pages/fontface.scss";
import "./pages/vocancy.scss";
import "./pages/visitka.scss";
import "./pages/startpage.scss";
import "./pages/Performers.scss";
import "./pages/guest.scss";
import "./pages/messenger.scss";
import 'font-awesome/css/font-awesome.css'
import "./fonts/CloisterBlack.ttf"
import "./fonts/Deutsch Gothic.ttf"
import "./fonts/matricha.ttf"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Messenger from "./components/GalaxyChat"
import Finder from "./components/Finder";
import MarketPage from "./components/GalacticMarket";
import MarketPlace from "./components/GalacticMarketPlace";
import GalaxyProfile from "./components/GalaxyProfile";
import StartPage from "./components/StartPage"
import News from "./components/Posts"

// function App() {

//   const { currentUser } = useContext(AuthContext);

//   const ProtectedRoute = ({ children }) => {
//     if (!currentUser) {
//       return <Navigate to="/login" />;
//     }

//     return children
//   };

function App() {
  const ProtectedRoute = ({ children }) => {
    const userKey = localStorage.getItem('userKey');
    if (!userKey) {
      return <Navigate to="/login" />;
    }
    return children;
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route 
            index element={
              <ProtectedRoute>
                <StartPage /> 
                {/* <Home /> */}
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/home/" element={<Home/>} />
          <Route path="/galaxy/" element={<GalaxyProfile/>} />
          {/* <Route path="/article/:id" element={<Article/>} /> */}
          {/* <Route path="/visitka/:id" element={<Visitka/>} /> */}
          <Route path="/startpage/" element={<StartPage/>} />
          {/* <Route path="/post/:id" element={<Post/>} /> */}
          <Route path="/news/" element={<News/>} />
          {/* <Route path="/guest/:id" element={<Guest/>} /> */}
          <Route path="/market/" element={<MarketPage/>} />
          <Route path="/marketplace/" element={<MarketPlace/>} />
          <Route path="/messenger/" element={<Messenger/>} />
          <Route path="/finder/" element={<Finder/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


