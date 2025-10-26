import { useState } from "react";
import { addOrder } from "../helpers/ordersService";

const AddOrderForm = ({ onOrderCreated }) => {
  const [form, setForm] = useState({
    folio: "",
    fecha: "",
    taller: "",
    tecnico: "",
    cliente: { nombre: "", telefono: "", direccion: "" },
    servicio: "",
    material: "",
    pago: "",
    costoMaterial: 0,
    manoDeObra: 0,
    total: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el campo pertenece al objeto cliente
    if (name.startsWith("cliente.")) {
      const field = name.split(".")[1];
      setForm({
        ...form,
        cliente: { ...form.cliente, [field]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addOrder(form);
      alert("✅ Orden creada correctamente");
      if (onOrderCreated) onOrderCreated(res.orden);
    } catch (err) {
      alert("❌ Error al crear la orden");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Nueva Orden</h2>
      <div>
        <label>Folio:</label>
        <input name="folio" value={form.folio} onChange={handleChange} required />
      </div>
      <div>
        <label>Fecha:</label>
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
      </div>
      <div>
        <label>Taller:</label>
        <input name="taller" value={form.taller} onChange={handleChange} required />
      </div>
      <div>
        <label>Técnico:</label>
        <input name="tecnico" value={form.tecnico} onChange={handleChange} required />
      </div>

      <h3>Cliente</h3>
      <div>
        <input placeholder="Nombre" name="cliente.nombre" value={form.cliente.nombre} onChange={handleChange} required />
        <input placeholder="Teléfono" name="cliente.telefono" value={form.cliente.telefono} onChange={handleChange} />
        <input placeholder="Dirección" name="cliente.direccion" value={form.cliente.direccion} onChange={handleChange} />
      </div>

      <h3>Detalles del servicio</h3>
      <div>
        <input placeholder="Servicio" name="servicio" value={form.servicio} onChange={handleChange} />
        <input placeholder="Material" name="material" value={form.material} onChange={handleChange} />
        <input placeholder="Pago" name="pago" value={form.pago} onChange={handleChange} />
        <input type="number" placeholder="Costo Material" name="costoMaterial" value={form.costoMaterial} onChange={handleChange} />
        <input type="number" placeholder="Mano de Obra" name="manoDeObra" value={form.manoDeObra} onChange={handleChange} />
      </div>

      <button type="submit">Guardar Orden</button>
    </form>
  );
};

export default AddOrderForm;
