import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ServiceOrders from './pages/ServiceOrders';

export default function App() {
  return (
    <div>
      <Header />
{/*       <Sidebar />
 */}      <main className="p-4 mt-20">
        <h1 className="text-xl font-bold mb-4">Órdenes de servicio</h1>
        <ServiceOrders />
      </main>
    </div>
  );
}
