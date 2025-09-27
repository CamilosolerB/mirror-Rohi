// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Login, Singup} from "./modules/login/pages"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/Singup" element={<Singup />} />           
        
        {/* Ruta 404 */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
