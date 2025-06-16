import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                setMessage("Prihlásenie úspešné!");
                setTimeout(() => navigate("/equipment"), 1000);
            } else {
                setMessage(data.message || "Chyba pri prihlasovaní");
            }
        } catch (err) {
            setMessage("Chyba sieťového spojenia");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                minWidth: "60vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: "40rem",
                paddingBottom: "10rem",
            }}
        >
            <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "600px" }}>
                <h3 className="text-center mb-4 text-primary">Prihlásenie</h3>

                {message && (
                    <div
                        className={`alert ${message.includes("úspešné") ? "alert-success" : "alert-danger"
                            }`}
                        role="alert"
                    >
                        {message}
                    </div>
                )}

                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Používateľ
                    </label>
                    <input
                        id="username"
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Zadajte používateľské meno"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Heslo
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Zadajte heslo"
                    />
                </div>

                <div className="d-grid">
                    <button className="btn btn-primary" onClick={handleLogin}>
                        Prihlásiť sa
                    </button>
                </div>
            </div>
        </div>
    );
}