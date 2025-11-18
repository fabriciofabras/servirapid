import { useEffect } from "react";

const Login = () => {
  const handleCredentialResponse = (response) => {
    console.log("ID Token:", response.credential);

    // Guardas login en localStorage
    localStorage.setItem("google_token", response.credential);

    // Redireccionas a la pantalla
    window.location.href = "/";
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "702231393128-8c0rs8g1s5fgnbrki95np36lco2tceu0.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return (
    <div>
      <h1>Iniciar sesión</h1>
      <div id="googleBtn"></div>
    </div>
  );
};

export default Login;