import React, { useState } from "react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        setMessage("");

        // Jednoduché overenie e-mailu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Zadajte platný e-mail.");
            return;
        }

        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            setMessage("Všetky polia sú povinné.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Heslá sa nezhodujú.");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Registrácia úspešná, môžete sa prihlásiť.");
            } else {
                setMessage(data.message || "Chyba pri registrácii");
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
                <h3 className="text-center mb-4 text-primary">Registrácia</h3>

                {message && (
                    <div
                        className={`alert ${message.includes("úspešná") ? "alert-success" : "alert-danger"
                            }`}
                        role="alert"
                    >
                        {message}
                    </div>
                )}

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="napr. meno@example.com"
                    />
                </div>

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

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                        Potvrďte heslo
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Zadajte heslo znova"
                    />
                </div>

                <div className="d-grid">
                    <button className="btn btn-primary" onClick={handleRegister}>
                        Registrovať sa
                    </button>
                </div>
            </div>
        </div>
    );
}
