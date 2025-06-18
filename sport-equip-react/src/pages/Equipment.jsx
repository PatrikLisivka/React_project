import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Equipment() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", description: "", price: "" });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

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
                    setErrorMessage(error.message || "Chyba pri načítaní vybavenia");
                }
            } catch (err) {
                setErrorMessage("Chyba sieťového spojenia");
            }
        };

        fetchItems();
    }, []);

    const deleteItem = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            if (res.ok) {
                setItems(items.filter((_, index) => index !== id));
                setSuccessMessage("Položka bola odstránená.");
                setErrorMessage("");
            } else {
                const error = await res.json();
                setErrorMessage(error.message || "Chyba pri odstraňovaní.");
            }
        } catch (err) {
            setErrorMessage("Chyba sieťového spojenia.");
        }
    };

    const addItem = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        const { name, description, price } = newItem;
        const priceNum = parseFloat(price);

        if (!name.trim() || !description.trim() || isNaN(priceNum) || priceNum <= 0) {
            setErrorMessage("Všetky polia sú povinné a cena musí byť kladné číslo.");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, item: { name, description, price: priceNum } }),
            });

            if (res.ok) {
                const added = await res.json();
                setItems([...items, added]);
                setSuccessMessage("Položka bola pridaná.");
                setNewItem({ name: "", description: "", price: "" });
            } else {
                const error = await res.json();
                setErrorMessage(error.message || "Chyba pri pridávaní.");
            }
        } catch {
            setErrorMessage("Chyba sieťového spojenia.");
        }
    };

    const handleChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mt-4">
            {message && <div className="alert alert-warning">{message}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <h3>Zoznam vybavení</h3>
            <table className="table table-striped table-hover table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Názov</th>
                        <th>Popis</th>
                        <th>Cena (€)</th>
                        <th>Akcie</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center py-4">Žiadne vybavenie</td>
                        </tr>
                    )}
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{Number(item.price).toFixed(2)}</td>
                            <td>
                                <button
                                    className="btn btn-info btn-sm me-2"
                                    onClick={() => navigate(`/update/${index}`)}
                                >
                                    Upraviť
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteItem(index)}
                                >
                                    Odstrániť
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 className="mt-4">Pridaj nové vybavenie</h3>
            <form onSubmit={addItem} className="mt-3">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Názov</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={newItem.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Popis</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={newItem.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Cena (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="price"
                        name="price"
                        value={newItem.price}
                        onChange={handleChange}
                        required
                        min="0.01"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Pridať vybavenie</button>
            </form>
        </div>
    );
}