
import React, { useContext, useState } from "react";
import { Container, Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form"
import { validateUser } from '../helpers/validateUser';
import { UserProfileContext } from "../UserProfileContext";
import { ChangePassword } from "./ChangePassword";

export const Login = ({ handleLogueado }) => {

  const { profile, setProfile } = useContext(UserProfileContext);

  const [formData, setFormData] = useState({
    usuario: "",
    password: ""
  });

  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [tempUserId, setTempUserId] = useState("");
  const [usuario, setUsuario] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sesionActiva, setSesionActiva] = useState(false);
  const [idSesion, setIdSesion] = useState("")
  const [cambioPass, setCambioPass] = useState("")
  const [forgotPassword, setForgotPassword] = useState(false)
  let confirmacionLoggeoNuevo;

  const validarUsuario = (confirmNewSession, userId) => {

    validateUser(formData, confirmNewSession, userId)
      .then((res) => {
        console.log("RES");
        console.log(res);
        if (res.message === "El usuario ha sido logueado") {
          setProfile(res)
          handleLogueado(true, res.perfil);
        } else if (res.message === "Debe cambiar su contraseña") {

          setFormData(prev => ({
            ...prev,
            password: ""
          }));

          console.log("usuario", res)
          setTempUserId(res.userId);
          setUsuario(res.usuario);
          setMustChangePassword(true);
        }
        else {

          if (res.message === "El usuario ya se encuentra loggeado. ¿Desea iniciar sesión en esta ventana?") {
            setProfile(res)
            setSesionActiva(true);
          }
          setError(res.message);
        }

      })
      .catch((e) => {
        console.log(e.message);
      });

  }

  const handleChangePassword = () => {

    setForgotPassword(true)
    setCambioPass("Contraseña inicial")


  }

  const login = (e) => {
    console.log('login')

    e.preventDefault();

    validarUsuario(false);
  }

  const handleChange = (e) => {

    console.log(e.target)
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleConfirmSesion = () => {

    validarUsuario(true, profile.usuarioSesion._id)

    console.log("handleConfirmSesion", profile.usuarioSesion._id)
  }

  const handleCancelSesion = () => {
    setSesionActiva(false);
    setError("");

  }

  if (mustChangePassword) {
    return (
      <ChangePassword
        textoCambioPass={"Contraseña actual"}
        usuario={usuario}
        userId={tempUserId}
        onPasswordChanged={() => {
          setMustChangePassword(false);
          setError("");
          setSuccess("Contraseña actualizada. Inicia sesión nuevamente.");
        }}
      />
    );
  }

  if (forgotPassword) {
    return (
      <ChangePassword
        textoCambioPass={"Contraseña inicial"}
        usuario={""}
        userId={tempUserId}
        onPasswordChanged={() => {
          setForgotPassword(false);
          setError("");
          setSuccess("Contraseña actualizada. Inicia sesión nuevamente.");
        }}
      />
    );
  }

  return (
    <Container 
  fluid 
  className="d-flex justify-content-center align-items-center py-5" 
  style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
>
  <Row className="w-100 justify-content-center px-3">
    <Col xs={12} sm={10} md={6} lg={4}>
      <div className="border p-4 rounded bg-white shadow-sm">

        <Form onSubmit={login}>
          {/* Usuario */}
          <Form.Group className="mb-3">
            <Form.Label>Email / usuario</Form.Label>
            <Form.Control
              value={formData.usuario}
              name="usuario"
              type="text"
              onChange={handleChange}
            />
          </Form.Group>

          {/* Contraseña */}
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              value={formData.password}
              name="password"
              type="password"
              onChange={handleChange}
            />
          </Form.Group>

          {/* Botón principal */}
          <Button type="submit" variant="danger" className="w-100 mt-3">
            Login
          </Button>

          {/* Mensajes */}
          {error && <p className="text-danger mt-3">{error}</p>}
          {success && <p className="text-success mt-3">{success}</p>}

          {/* Sesión activa */}
          {sesionActiva && (
            <div className="text-center mt-4">
              <p className="fw-semibold mb-2">¿Continuar sesión activa?</p>
              <div className="d-flex justify-content-center gap-3">
                <Button size="sm" variant="success" onClick={handleConfirmSesion}>
                  Sí
                </Button>
                <Button size="sm" variant="danger" onClick={handleCancelSesion}>
                  No
                </Button>
              </div>
            </div>
          )}

          {/* Olvidé contraseña */}
          {/* <div className="text-center mt-4">
            <a 
              className="m-3 text-primary fw-semibold" 
              style={{ cursor: "pointer", textDecoration: "underline" }} 
              onClick={handleChangePassword}
            >
              Olvidé mi contraseña
            </a>
          </div> */}
        </Form>
      </div>
    </Col>
  </Row>
</Container>




  );

}