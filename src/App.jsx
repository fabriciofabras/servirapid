import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ServiceOrders from './pages/ServiceOrders';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";

export default function App() {
  return (
    <div>
      <Header />
      {/*       <Sidebar />
 */}      <main className="p-4 mt-20">
        <h1 className="text-xl font-bold mb-4">Órdenes de servicio</h1>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ServiceOrders />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}
