import { useState } from "react";
import api from "../api/axios"; // Tu instancia de Axios con la URL de Render

export const Register = ({ onSwitch }) => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        try {
            // Le pegamos al endpoint de tu auth.routes.js
            const response = await api.post("/auth/register", { nombre, email, password });
            setSuccess(true);

            // Esperamos 2 segundos y lo mandamos al Login
            setTimeout(() => {
                onSwitch();
            }, 2000);
        } catch (err) {
            // Capturamos el mensaje de error ("Este correo ya está registrado", etc.)
            setError(err.response?.data?.mensaje || "Error al registrar el usuario");
        }
    };

    return (
        <div className="auth-container">
            <h2>Crear Cuenta Institucional</h2>
            {error && <p className="error-msg">{error}</p>}
            {success && <p className="success-msg">¡Usuario creado con éxito! Redirigiendo...</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tenés cuenta? <span onClick={onSwitch}>Iniciá sesión acá</span></p>
        </div>
    );
};