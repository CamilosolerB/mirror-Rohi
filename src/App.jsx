// src/App.jsx
import { Routes, Route } from "react-router-dom"; // No necesitas importar BrowserRouter aquí
import { Login, Singup, Verificar } from "./modules/login/pages";
import { Home } from "./modules/paciente/pages";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/Singup" element={<Singup />} />
      <Route path="/Verificar" element={<Verificar />} />
      <Route path="/Home" element={<Home />} />

      {/* Ruta 404 */}
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
}

export default App;
