import { useState, useEffect } from "react";
import { getOrders } from "../helpers/ordersService";
import ModalOrderForm from "../components/ModalOrderForm";
import * as XLSX from "xlsx";

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

export default function ServiceOrders({perfil}) {

    const [open, setOpen] = useState(false);

    const [orders, setOrders] = useState([]);
    
    const [user, setUser] = useState(null);

    // Callback llamado por Google
    window.handleCredentialResponse = async (response) => {
        const token = response.credential;
        console.log("token", token)
        // Decodificar token (contiene el email y nombre)
        const userInfo = JSON.parse(atob(token.split(".")[1]));
        console.log("userInfo", userInfo)


        setUser(userInfo);
    };

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
    }, [open]);

    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const filtered = orders.filter((o) => {
        const texto = search.toLowerCase();
        const fechaOrden = o.fecha; // formato YYYY-MM-DD

        // Filtro texto
        const matchesText =
            o.folio.toLowerCase().includes(texto) ||
            o.cliente.nombre.toLowerCase().includes(texto) ||
            o.fecha.toLowerCase().includes(texto) ||
            o.cliente.telefono.toLowerCase().includes(texto) ||
            o.taller.toLowerCase().includes(texto) ||
            o.tecnico.toLowerCase().includes(texto) ||
            o.pago.toLowerCase().includes(texto)

        // Filtro fecha inicial
        const matchesFrom = fromDate ? fechaOrden >= fromDate : true;

        // Filtro fecha final
        const matchesTo = toDate ? fechaOrden <= toDate : true;

        return matchesText && matchesFrom && matchesTo;
    });

    /*  const filtered = orders.filter(
         (o) =>
             o.folio.toLowerCase().includes(search.toLowerCase()) ||
             o.cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
             o.fecha.toLowerCase().includes(search.toLowerCase()) ||
             o.cliente.telefono.toLowerCase().includes(search.toLowerCase()) ||
             o.taller.toLowerCase().includes(search.toLowerCase()) ||
             o.tecnico.toLowerCase().includes(search.toLowerCase()) ||
             o.pago.toLowerCase().includes(search.toLowerCase())
     );
  */
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

    const exportToExcel = () => {
        // Usa los datos filtrados
        const dataToExport = filtered.map((o) => ({
            FOLIO: o.folio,
            FECHA: o.fecha,
            TALLER: o.taller,
            TECNICO: o.tecnico,
            NOMBRE: o.cliente.nombre,
            TELEFONO: o.cliente.telefono,
            DIRECCION: `${o.cliente.calle} ${o.cliente.noExterior} Int ${o.cliente.noInterior}, ${o.cliente.colonia}, ${o.cliente.alcaldia}`,
            SERVICIO: o.servicio,
            MATERIAL: o.material,
            PAGO: o.pago,
            TOTAL: o.total,
        }));

        // Crear hoja y libro
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Órdenes");

        // Descargar archivo
        XLSX.writeFile(wb, "ordenes_filtradas.xlsx");
    };

    const handleDescargarPDF = async (folio, correo) => {

        console.log("folio", folio)
        console.log("correo", correo)
        try {
            // 1. Descargar el PDF
            const response = await fetch(`https://servirapid-server.vercel.app/api/descargar-pdf/${folio}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("No se pudo descargar el PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Descargar localmente
            const a = document.createElement("a");
            a.href = url;
            a.download = `orden-${folio}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            // 2. Enviar por correo electrónico
            const enviarCorreo = await fetch("https://servirapid-server.vercel.app/api/enviar-pdf-correo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    folio,
                    email: correo
                })
            });

            if (!enviarCorreo.ok) {
                throw new Error("No se pudo enviar el PDF por correo");
            }

            alert("PDF enviado por correo correctamente.");

        } catch (error) {
            console.error(error);
            alert("Error al procesar la operación.");
        }
    };


    const parseFecha = (fecha) => {
        if (fecha.includes("/")) {
            const [d, m, y] = fecha.split("/");
            return new Date(`${y}-${m}-${d}`);
        }
        return new Date(fecha);
    }

    const ordered = [...filtered].sort((a, b) => {
        const fechaA = parseFecha(a.fecha);
        const fechaB = parseFecha(b.fecha);

        // 1️⃣ Ordenar por fecha descendente
        if (fechaB - fechaA !== 0) {
            return fechaB - fechaA;
        }

        // 2️⃣ Si la fecha es igual, ordenar por folio descendente
        return Number(b.folio) - Number(a.folio);
    });

    return (
        <div className="p-4 space-y-4">
            <main className="p-4 mt-2">
                <h1 className="text-xl font-bold mb-4">Órdenes de servicio</h1>
            </main>
            {/* Búsqueda */}
            <div className="space-y-3">

                {/* Línea de búsqueda y botones */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                    <input
                        type="text"
                        placeholder="Buscar por orden, cliente, taller, técnico o fecha"
                        className="w-full md:w-1/3 px-3 py-2 border rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={() => setOpen(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            + Nueva Orden
                        </button>
                        {perfil === "administrador" && (
                        <button
                            onClick={exportToExcel}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            📄 Exportar Excel
                        </button>
                        )}
                    </div>
                </div>

                {/* Fechas */}
                <div className="flex flex-col md:flex-row gap-2">
                    <input
                        type="date"
                        className="px-3 py-2 border rounded-lg w-full md:w-auto"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />

                    <input
                        type="date"
                        className="px-3 py-2 border rounded-lg w-full md:w-auto"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>

                <ModalOrderForm
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onSuccess={() => alert("Orden creada exitosamente")}
                />
            </div>

            {/* Tarjetas mobile */}
            <div className="block sm:hidden portrait:grid portrait:gap-4 landscape:hidden">
                {ordered.map((o) => (
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
                                <div>{o.cliente.telefono}</div>
                            </div>

                            <div className="col-span-2">
                                <div className="font-semibold">Dirección</div>
                                <div>{o.cliente.calle} {o.cliente.noExterior} Int {o.cliente.noInterior}, {o.cliente.colonia}, {o.cliente.alcaldia}</div>
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
                                <div className="font-semibold">Total</div>
                                <div className="font-bold">${o.total}</div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2 pt-2">
                            <button
                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                onClick={() => handleDescargarPDF(o.folio, o.cliente.correo)}
                            >
                                Descargar y Enviar Email
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabla desktop */}
            <div className="hidden landscape:block sm:block overflow-x-auto">
                <table className="min-w-full border rounded-lg">
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
                            <th className="p-2 border">Total</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ordered.map((o) => (
                            <tr key={o.id} className="text-sm hover:bg-gray-50">
                                <td className="p-2 border">{o.folio}</td>
                                <td className="p-2 border">{o.fecha}</td>
                                <td className="p-2 border">{o.taller}</td>
                                <td className="p-2 border">{o.tecnico}</td>
                                <td className="p-2 border">{o.cliente.nombre}</td>
                                <td className="p-2 border">{o.cliente.telefono}</td>
                                <td className="p-2 border">
                                    {o.cliente.calle} {o.cliente.noExterior} Int {o.cliente.noInterior}, {o.cliente.colonia}, {o.cliente.alcaldia}
                                </td>
                                <td className="p-2 border">{o.servicio}</td>
                                <td className="p-2 border">{o.material}</td>
                                <td className="p-2 border text-center">{paymentIcon(o.pago)}</td>
                                <td className="p-2 border font-bold">${o.total}</td>
                                <td className="p-2 border">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDescargarPDF(o.folio, o.cliente.correo)}
                                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                        >
                                            Descargar PDF
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
