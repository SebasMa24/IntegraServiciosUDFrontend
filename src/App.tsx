import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './App.css';
import Reservation from "./pages/Reservation";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container"> {/* Contenedor principal flex */}
        <Navbar />
        <main className="content-wrap"> {/* Contenedor del contenido principal */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reservations" element={<Reservation />} />
          </Routes>
        </main>
        <Footer /> {/* Footer siempre al final */}
      </div>
    </Router>
  );
};

export default App;