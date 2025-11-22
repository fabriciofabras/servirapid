// src/components/panelUnico/ChangePassword.jsx
import React, { useState } from "react";
import { Container, Button, Col, Row, Form } from "react-bootstrap";

export const ChangePassword = ({ textoCambioPass, usuario, userId, onPasswordChanged }) => {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        usuario: usuario
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.newPassword !== form.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {

            const service = (textoCambioPass == "Contraseña inicial" ? "forget-password" : "change-password")
            const res = await fetch(`http://localhost:3001/api/${service}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario: form.usuario,
                    userId,
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Contraseña cambiada correctamente");
                setTimeout(() => onPasswordChanged(), 1000);
            } else {
                setError(data.message || "Error al cambiar la contraseña");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={6} lg={4}>
                    <div className="border p-4 rounded bg-light shadow">
                        <h3 className="text-center mb-4">Cambio de Contraseña</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control
                                    type="input"
                                    name="usuario"
                                    value={form.usuario}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>{textoCambioPass}</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="currentPassword"
                                    value={form.currentPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Nueva contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="newPassword"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Confirmar nueva contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" variant="primary" className="w-100 mt-3">
                                Cambiar contraseña
                            </Button>

                            {error && <p className="text-danger mt-3">{error}</p>}
                            {success && <p className="text-success mt-3">{success}</p>}
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
