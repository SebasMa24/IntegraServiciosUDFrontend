import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Operation from "./pages/Operation/Operation";
import Availability from "./pages/Availability/Availability";
import './App.css';
import OperationHardwareDetails from "./pages/Operation/OperationHardwareDetails";

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
            <Route path="/operation" element={<Operation />} />
            <Route path="/operation/details/hardware/:id" element={<OperationHardwareDetails />} />
            <Route path="/availability" element={<Availability />} />
          </Routes>
        </main>
        <Footer /> {/* Footer siempre al final */}
      </div>
    </Router>
  );
};

export default App;
