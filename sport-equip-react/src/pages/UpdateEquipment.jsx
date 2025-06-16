import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateEquipment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Nie ste prihlásený.");
            setLoading(false);
            return;
        }

        equipmentService.getEquipmentById(id)
            .then((res) => {
                const data = res.data;
                setFormData({
                    name: data.name,
                    description: data.description,
                    price: data.price.toString(),
                });
                setLoading(false);
            })
            .catch(() => {
                setError("Nepodarilo sa načítať dáta.");
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");
        const priceNum = parseFloat(formData.price);

        if (!formData.name.trim() || !formData.description.trim() || isNaN(priceNum) || priceNum <= 0) {
            setError("Všetky polia sú povinné a cena musí byť kladné číslo.");
            return;
        }

        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    item: {
                        name: formData.name,
                        description: formData.description,
                        price: priceNum,
                    },
                }),
            });

            if (res.ok) {
                setSuccess("Vybavenie bolo úspešne upravené.");
                setTimeout(() => navigate("/equipment"), 1500); // presmeruj späť po 1.5s
            } else {
                const errData = await res.json();
                setError(errData.message || "Chyba pri ukladaní.");
            }
        } catch {
            setError("Chyba spojenia.");
        }
    };

    if (loading) return <div className="text-center mt-5">Načítavam...</div>;

    return (
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
            <h3 className="text-center mb-4">Upraviť vybavenie</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Názov</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Popis</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Cena (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0.01"
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Uložiť zmeny</button>
            </form>
        </div>
    );
}
