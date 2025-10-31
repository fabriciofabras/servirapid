import { useState, useEffect } from "react";
import { getOrders } from "../helpers/ordersService";
import ModalOrderForm from "../components/ModalOrderForm";

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

    const [open, setOpen] = useState(false);

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                console.log()
                setOrders(data);
            } catch (err) {
                console.error("No se pudieron cargar las órdenes:", err);
            }
        };

        fetchOrders();
    }, []);

    const [search, setSearch] = useState("");

    const filtered = orders.filter(
        (o) =>
            o.folio.toLowerCase().includes(search.toLowerCase()) ||
            o.cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
            o.fecha.toLowerCase().includes(search.toLowerCase())
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

    const handleDescargarPDF = async (folio) => {
        try {
            const response = await fetch(`https://servirapid-server.vercel.app/api/descargar-pdf/${folio}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("No se pudo descargar el PDF");
            }

            // Convertir la respuesta a blob (archivo binario)
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Crear enlace temporal para descargar
            const a = document.createElement("a");
            a.href = url;
            a.download = `orden-${folio}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Limpiar el objeto URL temporal
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Error al descargar el PDF");
        }
    }
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
                <button
                    onClick={() => setOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    + Nueva Orden
                </button>

                <ModalOrderForm
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onSuccess={() => alert("Orden creada exitosamente")}
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
                                <div>{o.folio}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Fecha</div>
                                <div>{o.fecha}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Nombre</div>
                                <div>{o.cliente.nombre}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Teléfono</div>
                                <div>{o.telefono}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Dirección</div>
                                <div>{o.cliente.direccion}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Taller</div>
                                <div>{o.cliente.taller}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Técnico</div>
                                <div>{o.tecnico}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Servicio</div>
                                <div>{o.servicio}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Material</div>
                                <div>{o.material}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Pago</div>
                                <div>{o.pago} {paymentIcon(o.pago)}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Costo Material</div>
                                <div>${o.costoMaterial}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Mano de obra</div>
                                <div>${o.manoDeObra}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Total</div>
                                <div className="font-bold">${o.total}</div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => handleDescargarPDF(o.folio)}
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">
                                Descargar PDF
                            </button>
                            {/* <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">
                                Eliminar
                            </button> */}
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
                                <td className="p-2 border">{o.folio}</td>
                                <td className="p-2 border">{o.fecha}</td>
                                <td className="p-2 border">{o.taller}</td>
                                <td className="p-2 border">{o.tecnico}</td>
                                <td className="p-2 border">{o.cliente.nombre}</td>
                                <td className="p-2 border">{o.cliente.telefono}</td>
                                <td className="p-2 border">{o.cliente.direccion}</td>
                                <td className="p-2 border">{o.servicio}</td>
                                <td className="p-2 border">{o.material}</td>
                                <td className="p-2 border text-center">{paymentIcon(o.pago)}</td>
                                <td className="p-2 border">${o.costoMaterial}</td>
                                <td className="p-2 border">${o.manoDeObra}</td>
                                <td className="p-2 border font-bold">${o.total}</td>
                                <td className="p-2 border">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleDescargarPDF(o.folio)}
                                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
                                            Descargar PDF
                                        </button>
                                        {/* <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                                            Eliminar
                                        </button> */}
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
