import { useState } from "react";

const dummyOrders = [
    {
        id: "SRV-001",
        fecha: "2025-09-18",
        taller: "Taller Norte",
        tecnico: "Juan Pérez",
        nombre: "Carlos López",
        telefono: "555-1234",
        direccion: "Calle 123, CDMX",
        tipoServicio: "Instalación",
        material: "Cableado",
        tipoPago: "Efectivo",
        costoMaterial: 500,
        costoManoObra: 800,
        total: 1300,
    },
    {
        id: "SRV-002",
        fecha: "2025-09-19",
        taller: "Taller Sur",
        tecnico: "Ana Torres",
        nombre: "María García",
        telefono: "555-9876",
        direccion: "Av. Reforma 456, CDMX",
        tipoServicio: "Mantenimiento",
        material: "Tubería",
        tipoPago: "Tarjeta",
        costoMaterial: 300,
        costoManoObra: 600,
        total: 900,
    },
];

export default function ServiceOrders() {
    const [search, setSearch] = useState("");

    const filtered = dummyOrders.filter(
        (o) =>
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const paymentIcon = (tipo) => {
        switch (tipo.toLowerCase()) {
            case "efectivo":
                return "💵";
            case "tarjeta":
                return "💳";
            case "transferencia":
                return "🏦";
            default:
                return "❓";
        }
    };

    return (
        <div className="p-4">
            {/* Búsqueda */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por # servicio o nombre"
                    className="w-full md:w-1/3 px-3 py-2 border rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Tarjetas mobile */}
            <div className="md:hidden grid gap-4">
                {filtered.map((o) => (
                    <div
                        key={o.id}
                        className="bg-white rounded-xl shadow p-4 border"
                    >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="font-semibold"># Servicio</div>
                                <div>{o.id}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Fecha</div>
                                <div>{o.fecha}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Nombre</div>
                                <div>{o.nombre}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Teléfono</div>
                                <div>{o.telefono}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Dirección</div>
                                <div>{o.direccion}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Taller</div>
                                <div>{o.taller}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Técnico</div>
                                <div>{o.tecnico}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Servicio</div>
                                <div>{o.tipoServicio}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Material</div>
                                <div>{o.material}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Pago</div>
                                <div>{o.tipoPago} {paymentIcon(o.tipoPago)}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Costo Material</div>
                                <div>${o.costoMaterial}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Mano de obra</div>
                                <div>${o.costoManoObra}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Total</div>
                                <div className="font-bold">${o.total}</div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2 pt-2">
                            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">
                                Editar
                            </button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            {/* Tabla desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">#</th>
                            <th className="p-2 border">Fecha</th>
                            <th className="p-2 border">Taller</th>
                            <th className="p-2 border">Técnico</th>
                            <th className="p-2 border">Nombre</th>
                            <th className="p-2 border">Teléfono</th>
                            <th className="p-2 border">Dirección</th>
                            <th className="p-2 border">Servicio</th>
                            <th className="p-2 border">Material</th>
                            <th className="p-2 border">Pago</th>
                            <th className="p-2 border">Costo Material</th>
                            <th className="p-2 border">Mano de obra</th>
                            <th className="p-2 border">Total</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((o) => (
                            <tr key={o.id} className="text-sm">
                                <td className="p-2 border">{o.id}</td>
                                <td className="p-2 border">{o.fecha}</td>
                                <td className="p-2 border">{o.taller}</td>
                                <td className="p-2 border">{o.tecnico}</td>
                                <td className="p-2 border">{o.nombre}</td>
                                <td className="p-2 border">{o.telefono}</td>
                                <td className="p-2 border">{o.direccion}</td>
                                <td className="p-2 border">{o.tipoServicio}</td>
                                <td className="p-2 border">{o.material}</td>
                                <td className="p-2 border text-center">{paymentIcon(o.tipoPago)}</td>
                                <td className="p-2 border">${o.costoMaterial}</td>
                                <td className="p-2 border">${o.costoManoObra}</td>
                                <td className="p-2 border font-bold">${o.total}</td>
                                <td className="p-2 border">
                                    <div className="flex gap-2">
                                        <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
                                            Editar
                                        </button>
                                        <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
