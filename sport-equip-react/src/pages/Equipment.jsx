import React, { useEffect, useState } from "react";

export default function Equipment() {
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("Nie ste prihlásený");
                return;
            }

            try {
                const res = await fetch("/api/listofitems", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setItems(data);
                } else {
                    const error = await res.json();
                    setMessage(error.message || "Chyba pri načítaní vybavenia");
                }
            } catch (err) {
                setMessage("Chyba sieťového spojenia");
            }
        };

        fetchItems();
    }, []);

    return (
        <div>
            <h2>Vybavenie</h2>
            {message && <p>{message}</p>}
            <ul>
                {items.map((item, idx) => (
                    <li key={idx}>
                        <strong>{item.name}</strong> - {item.description} (Cena: {item.price} €)
                    </li>
                ))}
            </ul>
        </div>
    );
}