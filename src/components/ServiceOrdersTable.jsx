const dummyOrders = [
  {
    id: 1,
    fecha: '2025-09-16',
    taller: 'Taller Norte',
    tecnico: 'Juan Pérez',
    nombre: 'Carlos Gómez',
    telefono: '555-1234',
    direccion: 'Av. Reforma 123',
    tipoServicio: 'Mantenimiento',
    material: 'Cable',
    tipoPago: 'Efectivo',
    costoMaterial: 500,
    costoManoObra: 800,
    total: 1300
  },
  {
    id: 2,
    fecha: '2025-09-17',
    taller: 'Taller Sur',
    tecnico: 'Ana López',
    nombre: 'María Ruiz',
    telefono: '555-5678',
    direccion: 'Insurgentes 456',
    tipoServicio: 'Instalación',
    material: 'Tubería',
    tipoPago: 'Tarjeta',
    costoMaterial: 300,
    costoManoObra: 1200,
    total: 1500
  }
];

export default function ServiceOrdersTable() {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th>#</th><th>Fecha</th><th>Taller</th><th>Técnico</th>
            <th>Nombre</th><th>Teléfono</th><th>Dirección</th>
            <th>Tipo de Servicio</th><th>Material</th><th>Tipo de pago</th>
            <th>Costo Material</th><th>Costo Mano de obra</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          {dummyOrders.map(o => (
            <tr key={o.id} className="border-b">
              <td>{o.id}</td>
              <td>{o.fecha}</td>
              <td>{o.taller}</td>
              <td>{o.tecnico}</td>
              <td>{o.nombre}</td>
              <td>{o.telefono}</td>
              <td>{o.calle}</td>
              <td>{o.tipoServicio}</td>
              <td>{o.material}</td>
              <td>{o.tipoPago}</td>
              <td>${o.costoMaterial}</td>
              <td>${o.costoManoObra}</td>
              <td>${o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
