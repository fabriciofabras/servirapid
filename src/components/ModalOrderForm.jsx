import React, { useState } from "react";
import { addOrder } from "../helpers/ordersService";
import FirmaDigital from "./FirmaDigital";
import { Button, Modal } from "react-bootstrap";

export default function ModalOrderForm({ isOpen, onClose, onSuccess }) {

    const baseInput =
        "w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-gray-900 " +
        "focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 " +
        "outline-none transition-all duration-200";
    const baseLabel = "font-medium text-gray-700 mb-1";

    const [showFirma, setShowFirma] = useState(false);
    const [showFirmaTecnico, setShowFirmaTecnico] = useState(false);

    const [form, setForm] = useState({
        folio: "",
        fecha: "",
        taller: "alamos",
        tecnico: "rodrigo",
        cliente: { nombre: "", tipoId:"",telefono: "", calle: "", noExterior: "", noInterior: "", colonia: "", alcaldia: "" },
        auto: { placas: "", noSerie: "", marca: "", tipoAuto: "" },
        trabajo: "hogar",
        servicio: "",
        material: "",
        pago: "efectivo",
        costoMaterial: null,
        manoDeObra: null,
        total: null,
        firma: null,
        firmaTecnico: null,
        observaciones: ""
    });

    const handleGuardarFirma = (dataURL) => {
        console.log(dataURL)
        setForm((prev) => ({ ...prev, firma: dataURL }));
        setShowFirma(false);
    };

    const handleGuardarFirmaTecnico = (dataURL) => {
        console.log(dataURL)
        setForm((prev) => ({ ...prev, firmaTecnico: dataURL }));
        setShowFirmaTecnico(false);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Si el nombre tiene punto, es un campo anidado (ej. cliente.nombre o auto.placas)
        if (name.includes(".")) {
            const [parent, field] = name.split(".");
            setForm((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [field]: value,
                },
            }));
        } else {
            // Si no tiene punto, es un campo normal
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
            const res = await fetch("https://servirapid-server.vercel.app/api/generar-pdf", {
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
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-4 md:rounded-2xl md:w-[600px] md:mx-auto md:mt-10">
            <div className="flex justify-between items-center border-b pb-2">
                {/*                 <h2 className="text-2xl font-semibold mb-4 text-gray-800">Nueva Orden</h2>
 */}

                {/* Modal de firma */}
                {showFirma && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-lg relative">
                            <button
                                type="button"
                                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                                onClick={() => setShowFirma(false)}
                            >
                                ✕
                            </button>
                            <h2 className="text-lg font-semibold mb-3 text-center">
                                Firma del cliente
                            </h2>
                            <FirmaDigital onGuardarFirma={handleGuardarFirma} />
                        </div>
                    </div>
                )}

                {showFirmaTecnico && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-lg relative">
                            <button
                                type="button"
                                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                                onClick={() => setShowFirmaTecnico(false)}
                            >
                                ✕
                            </button>
                            <h2 className="text-lg font-semibold mb-3 text-center">
                                Firma del técnico
                            </h2>
                            <FirmaDigital onGuardarFirma={handleGuardarFirmaTecnico} />
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="w-full space-y-6">


                    <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="inline-block w-1.5 h-5 bg-blue-500 rounded"></span>
                            Datos de la orden                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {/* <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-600 mb-1">Folio</label>
                                <input
                                    name="folio"
                                    value={form.folio}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>
 */}
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-600 mb-1">Fecha</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={form.fecha}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-600 mb-1">Taller</label>
                                <select
                                    name="taller"
                                    value={form.taller}
                                    onChange={handleChange}
                                    className={baseInput}
                                    required
                                >
                                    <option value="alamos">Álamos</option>
                                    <option value="echegaray">Echegaray</option>

                                </select>

                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-600 mb-1">Técnico</label>
                                <select
                                    name="tecnico"
                                    value={form.tecnico}
                                    onChange={handleChange}
                                    className={baseInput}>
                                    <option value="rodrigo">Rodrigo Esquivel Bejarano</option>
                                    <option value="javier">Javier Martínez Huerta</option>
                                    <option value="jair">Jair Sánchez Rivera</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-3 gap-3">
                    </div>

                    <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm">
                        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="inline-block w-1 h-4 bg-blue-600 rounded"></span>
                            Datos del Cliente
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex flex-col">
                                <label className={baseLabel}>Nombre</label>
                                <input
                                    name="cliente.nombre"
                                    value={form.cliente.nombre}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={baseLabel}>Teléfono</label>
                                <input
                                    name="cliente.telefono"
                                    value={form.cliente.telefono}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>

                            <div className="flex flex-col sm:col-span-1">
                                <label className={baseLabel}>Calle</label>
                                <input
                                    name="cliente.calle"
                                    value={form.cliente.calle}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>
                            <div className="flex flex-col sm:col-span-1">
                                <label className={baseLabel}>No. Exterior</label>
                                <input
                                    name="cliente.noExterior"
                                    value={form.cliente.noExterior}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>
                            <div className="flex flex-col sm:col-span-1">
                                <label className={baseLabel}>No. Interior</label>
                                <input
                                    name="cliente.noInterior"
                                    value={form.cliente.noInterior}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>
                            <div className="flex flex-col sm:col-span-1">
                                <label className={baseLabel}>Colonia</label>
                                <input
                                    name="cliente.colonia"
                                    value={form.cliente.colonia}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>
                            <div className="flex flex-col sm:col-span-1">
                                <label className={baseLabel}>Alc. o Del.</label>
                                <input
                                    name="cliente.alcaldia"
                                    value={form.cliente.alcaldia}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={baseLabel}>Identificación</label>
                                <select
                                    name="cliente.tipoId"
                                    value={form.cliente.tipoId || ""}
                                    onChange={handleChange}
                                    required
                                    className={`${baseInput} bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="gray" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>')] bg-no-repeat bg-[right_0.75rem_center] pr-8`}
                                >
                                    <option value="INE">INE</option>
                                    <option value="Licencia">Licencia</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                    <option value="Sin identificación">Sin identificación</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Horarios */}
                    <div className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
                        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="inline-block w-1.5 h-5 bg-blue-500 rounded"></span>
                            Horarios
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Hora de Asignación</label>
                                <input
                                    type="time"
                                    name="horaAsignacion"
                                    value={form.horaAsignacion || ""}
                                    onChange={handleChange}
                                    className={baseInput}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Hora de Contacto</label>
                                <input
                                    type="time"
                                    name="horaContacto"
                                    value={form.horaContacto || ""}
                                    onChange={handleChange}
                                    className={baseInput}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Hora de Término</label>
                                <input
                                    type="time"
                                    name="horaTermino"
                                    value={form.horaTermino || ""}
                                    onChange={handleChange}
                                    className={baseInput}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Fecha de Término</label>
                                <input
                                    type="date"
                                    name="fechaTermino"
                                    value={form.fechaTermino || ""}
                                    onChange={handleChange}
                                    className={baseInput}
                                    required
                                />
                            </div>
                        </div>
                    </div>




                    {/* Trabajo a realizar */}
                    <div className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
                        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="inline-block w-1.5 h-5 bg-blue-500 rounded"></span>
                            Trabajo a realizar
                        </h3>

                        <div className="flex flex-col mb-4">
                            <label className="text-sm font-medium text-gray-600 mb-1">Tipo de Trabajo</label>
                            <select
                                name="trabajo"
                                value={form.trabajo || ""}
                                onChange={handleChange}
                                className={baseInput}
                                required
                            >
                                <option value="Hogar">Hogar</option>
                                <option value="Auto">Auto</option>
                            </select>
                        </div>

                        {form.trabajo === "Auto" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Placas</label>
                                    <input
                                        name="auto.placas"
                                        value={form.auto?.placas || ""}
                                        onChange={handleChange}
                                        className={baseInput}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">No. de Serie</label>
                                    <input
                                        name="auto.noSerie"
                                        value={form.auto?.noSerie || ""}
                                        onChange={handleChange}
                                        className={baseInput}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Marca</label>
                                    <input
                                        name="auto.marca"
                                        value={form.auto?.marca || ""}
                                        onChange={handleChange}
                                        className={baseInput}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Tipo de Auto</label>
                                    <input
                                        name="auto.tipoAuto"
                                        value={form.auto?.tipoAuto || ""}
                                        onChange={handleChange}
                                        className={baseInput}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Año</label>
                                    <input
                                        type="number"
                                        name="auto.anio"
                                        value={form.auto?.anio || ""}
                                        onChange={handleChange}
                                        className={baseInput}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
                        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="inline-block w-1.5 h-5 bg-blue-500 rounded"></span>
                            Servicio
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Servicio</label>
                                <input
                                    name="servicio"
                                    value={form.servicio}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Material</label>
                                <input
                                    name="material"
                                    value={form.material}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Método de Pago</label>
                                <select
                                    name="pago"
                                    value={form.pago}
                                    onChange={handleChange}
                                    className={baseInput}
                                >
{/*                                     <option value="">Seleccionar...</option>
 */}                                    <option value="efectivo">Efectivo</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="transferencia">Transferencia</option>
                                </select>
                            </div>

                            {/*  <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Costo Material</label>
                                <input
                                    type="number"
                                    name="costoMaterial"
                                    value={form.costoMaterial}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Mano de Obra</label>
                                <input
                                    type="number"
                                    name="manoDeObra"
                                    value={form.manoDeObra}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>
 */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Total</label>
                                <input
                                    type="number"
                                    name="total"
                                    value={form.total}
                                    onChange={handleChange}
                                    className={baseInput}
                                />
                            </div>
                        </div>

                        {/* Observaciones */}
                        <div className="mt-4">
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Observaciones</label>
                            <textarea
                                name="observaciones"
                                placeholder="Escribe aquí las observaciones..."
                                value={form.observaciones || ""}
                                onChange={handleChange}
                                className={`${baseInput} resize-none w-full`}
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Calidad del servicio
                            </label>
                            <select
                                name="calidadServicio"
                                value={form.calidadServicio || ""}
                                onChange={handleChange}
                                className={baseInput}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Excelente">Excelente</option>
                                <option value="Bueno">Bueno</option>
                                <option value="Regular">Regular</option>
                                <option value="Malo">Malo</option>
                            </select>
                        </div>
                    </div>

                    {/* Botón para abrir firma */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="mt-4 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setShowFirma(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all"
                            >
                                {form.firma ? "Ver / Editar firma" : "Firma cliente"}
                            </button>

                            {form.firma && (
                                <img
                                    src={form.firma}
                                    alt="Firma cliente"
                                    className="w-24 border border-gray-400 rounded-md"
                                />
                            )}
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setShowFirmaTecnico(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all"
                            >
                                {form.firma ? "Ver / Editar firma" : "Firma técnico"}
                            </button>

                            {form.firma && (
                                <img
                                    src={form.firmaTecnico}
                                    alt="Firma técnico"
                                    className="w-24 border border-gray-400 rounded-md"
                                />
                            )}
                        </div>

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
            </div >
        </div >
    );
}
