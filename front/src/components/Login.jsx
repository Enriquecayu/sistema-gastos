import { useState } from "react";
import api from "../api/axios";

export const Login = ({ onLoginSuccess, onSwitch }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/auth/login", { email, password });

            // Tu back devuelve: { token, usuario: { id, nombre, email } }
            const { token, usuario } = response.data;

            // Guardamos en el almacenamiento del navegador
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(usuario));

            // Le avisamos a App.jsx que el usuario ya ingresó
            onLoginSuccess(usuario);
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al iniciar sesión");
        }
    };

    return (
        <div className="auth-container">
            <h2>Iniciar Sesión</h2>
            {error && <p className="error-msg">{error}</p>}

            <form onSubmit={handleSubmit}>
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
                <button type="submit">Ingresar</button>
            </form>
            <p>¿No tenés cuenta? <span onClick={onSwitch}>Registrate acá</span></p>
        </div>
    );
};