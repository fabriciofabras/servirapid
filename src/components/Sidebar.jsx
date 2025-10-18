import { useState } from 'react';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="mt-16">
      {/* Menú mobile */}
      <div className="block md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-2xl"
        >
          &#9776; {/* ← Ícono hamburguesa Unicode */}
        </button>

        {open && (
          <div className="absolute top-16 left-0 w-48 bg-gray-200 shadow-md p-4">
            <button className="block w-full text-left p-2 hover:bg-gray-300">
              Órdenes de servicio
            </button>
          </div>
        )}
      </div>

      {/* Menú escritorio */}
      <div className="hidden md:flex gap-4 p-4 bg-gray-100">
        <button className="hover:underline">Órdenes de servicio</button>
      </div>
    </nav>
  );
}
