import React, { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
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
        <div>
            <h2>Registrácia</h2>
            <input
                type="text"
                placeholder="Používateľ"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Heslo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Registrovať sa</button>
            <p>{message}</p>
        </div>
    );
}