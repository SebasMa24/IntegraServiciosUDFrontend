import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Operation from "./pages/Operation/Operation";
import Availability from "./pages/Availability/Availability";
import Resource from "./pages/Resource";
import OperationHardwareDetails from "./pages/Operation/OperationHardwareDetails";
import OperationSpaceDetails from "./pages/Operation/OperationSpaceDetails";
import StoredHardwareDetails from "./pages/Availability/StoredHardwareDetails";
import SpaceDetails from "./pages/Availability/SpaceDetails";
import './App.css';

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
            <Route path="/operation/details/space/:id" element={<OperationSpaceDetails />} />
            <Route path="/resource" element={<Resource />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/availability/details/hardware/:id" element={<StoredHardwareDetails />} />
            <Route path="/availability/details/space/:id" element={<SpaceDetails />} />
          </Routes>
        </main>
        <Footer /> {/* Footer siempre al final */}
      </div>
    </Router>
  );
};

export default App;