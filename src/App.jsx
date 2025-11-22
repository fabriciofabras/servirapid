import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ServiceOrders from './pages/ServiceOrders';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Login } from "./components/Login";
import { UserProfileProvider } from "./UserProfileContext";
import { useState } from "react";

export default function App() {
  const [logueado, setLogueado] = useState(false);
  const [perfil, setPerfil] = useState("");

  const handleLogueado = (conectado, perfilUsuario) => {
    console.log("conectado", conectado)
    setLogueado(conectado)
    setPerfil(perfilUsuario)
  }

  return (
    <main className="main-container text-black-400 body-font pt-20">
      <Header />
      <UserProfileProvider>
        {logueado ? <ServiceOrders perfil={perfil} /> : <Login handleLogueado={handleLogueado} />}
      </UserProfileProvider>
    </main>
  );
}
