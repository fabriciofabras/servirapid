import React, { useState } from "react";
import { addOrder } from "../helpers/ordersService";

export default function ModalOrderForm({ isOpen, onClose, onSuccess }) {
    const [form, setForm] = useState({
        folio: "",
        fecha: "",
        taller: "",
        tecnico: "",
        cliente: { nombre: "", telefono: "", direccion: "" },
        servicio: "",
        material: "",
        pago: "",
        costoMaterial: null,
        manoDeObra: null,
        total: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("cliente.")) {
            const field = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                cliente: { ...prev.cliente, [field]: value },
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addOrder(form);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al crear orden:", error);
        }

        try {
            const res = await fetch("http://localhost:4000/api/generar-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            console.log("PDF generado:", data);

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Nueva Orden</h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                        <input name="folio" placeholder="Folio" value={form.folio} onChange={handleChange} className="input mb-2" />
                        <input name="fecha" type="date" value={form.fecha} onChange={handleChange} className="input mb-2" />
                        <input name="taller" placeholder="Taller" value={form.taller} onChange={handleChange} className="input mb-2" />
                        {/*                         <input name="tecnico" placeholder="Técnico" value={form.tecnico} onChange={handleChange} className="input mb-2" />
 */}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                    </div>

                    <div className="p-3 border rounded-lg bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Datos del Cliente</h3>
                        <div className="grid grid-cols-4 gap-3">
                            <label>Nombre</label>
                            <input name="cliente.nombre" value={form.cliente.nombre} onChange={handleChange} className="input mb-2" />
                            <label>Teléfono:</label>

                            <input name="cliente.telefono" placeholder="Teléfono" value={form.cliente.telefono} onChange={handleChange} className="input mb-2" />
                            <label>Dirección:</label>

                            <input name="cliente.direccion" placeholder="Dirección" value={form.cliente.direccion} onChange={handleChange} className="input mb-2" />
                            <label>tipo de ID:</label>

                            <input
                                name="cliente.tipoId"
                                placeholder="Tipo de ID"
                                value={form.cliente.tipoId || ""}
                                onChange={handleChange}
                                className="input mb-2" required
                            />
                        </div>
                    </div>

                    {/* Horarios */}
                    <div className="p-3 border rounded-lg bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Horarios</h3>
                        <div className="grid grid-cols-4 gap-3">
                            <label>Hora asignación:</label>
                            <input
                                name="horaAsignacion"
                                type="time"
                                value={form.horaAsignacion || ""}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                            <label>Hora contacto:</label>
                            <input
                                name="horaContacto"
                                type="time"
                                value={form.horaContacto || ""}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                            <label>Hora termino:</label>

                            <input
                                name="horaTermino"
                                type="time"
                                value={form.horaTermino || ""}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                            <label>Fecha termino:</label>
                            <input
                                name="fechaTermino"
                                type="date"
                                value={form.fechaTermino || ""}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>
                    </div>



                    {/* Trabajo a realizar */}
                    <div className="p-3 border rounded-lg bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Trabajo a realizar</h3>

                        <select
                            name="trabajo"
                            value={form.trabajo || ""}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="">Seleccionar...</option>
                            <option value="Hogar">Hogar</option>
                            <option value="Auto">Auto</option>
                        </select>
                        {/* Campos adicionales si es Auto */}
                        {form.trabajo === "Auto" && (
                            <div className="grid grid-cols-4 gap-3">
                                <label>Placas:</label>
                                <input
                                    name="auto.placas"
                                    value={form.auto?.placas || ""}
                                    onChange={handleChange}
                                    className="input mb-2"
                                    required
                                />
                                <label>No Serie:</label>
                                <input
                                    name="auto.noSerie"
                                    value={form.auto?.noSerie || ""}
                                    onChange={handleChange}
                                    className="input mb-2"
                                    required
                                />
                                <label>Marca:</label>
                                <input
                                    name="auto.marca"
                                    value={form.auto?.marca || ""}
                                    onChange={handleChange}
                                    className="input mb-2"
                                    required
                                />
                                <label>Tipo auto:</label>
                                <input
                                    name="auto.tipoAuto"
                                    value={form.auto?.tipoAuto || ""}
                                    onChange={handleChange}
                                    className="input mb-2"
                                    required
                                />
                                <label>Año:</label>
                                <input
                                    name="auto.anio"
                                    type="number"
                                    value={form.auto?.anio || ""}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                        )}
                    </div>


                    <div className="p-3 border rounded-lg bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Servicio</h3>
                        <div className="grid grid-cols-4 gap-3">
                            <input name="servicio" placeholder="Servicio" value={form.servicio} onChange={handleChange} className="input" />
                            <input name="material" placeholder="Material" value={form.material} onChange={handleChange} className="input" />
                            <select name="pago" value={form.pago} onChange={handleChange} className="input">
                                <option value="">Método de pago</option>
                                <option value="💵">Efectivo</option>
                                <option value="💳">Tarjeta</option>
                            </select>
                            <input name="costoMaterial" type="number" placeholder="Costo Material" value={form.costoMaterial} onChange={handleChange} className="input" />
                            <input name="manoDeObra" type="number" placeholder="Mano de obra" value={form.manoDeObra} onChange={handleChange} className="input" />
                            <input name="total" type="number" placeholder="Total" value={form.total} onChange={handleChange} className="input" />

                        </div>

                        <div className="grid grid-cols-2 gap-3">
                        </div>

                        {/* Observaciones */}
                        <textarea
                            name="observaciones"
                            placeholder="Observaciones"
                            value={form.observaciones || ""}
                            onChange={handleChange}
                            className="input w-full"
                            rows="3"
                        />
                    </div>

                    {/* Calidad del servicio */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Calidad del servicio
                        </label>
                        <select
                            name="calidadServicio"
                            value={form.calidadServicio || ""}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="">Seleccionar...</option>
                            <option value="Excelente">Excelente</option>
                            <option value="Bueno">Bueno</option>
                            <option value="Regular">Regular</option>
                            <option value="Malo">Malo</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
