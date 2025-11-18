import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ServiceOrders from './pages/ServiceOrders';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";

export default function App() {
  return (
    <div>
      <Header />
      {/*       <Sidebar />
 */}

   {/*    <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute> */}
                <ServiceOrders />
              {/* </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}
