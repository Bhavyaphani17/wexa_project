
import { useEffect, useState } from "react";
import api from "../services/api";

function Settings() {
    const [threshold, setThreshold] = useState(5);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get("/settings");
            setThreshold(response.data.defaultLowStockThreshold);
        } catch (err) {
            setError("Unable to load settings.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!Number.isInteger(Number(threshold)) || Number(threshold) < 0) {
            setError("Please enter a valid non-negative whole number.");
            return;
        }

        try {
            setSaving(true);

            const response = await api.put("/settings", {
                defaultLowStockThreshold: Number(threshold),
            });

            setThreshold(response.data.defaultLowStockThreshold);
            setMessage("Settings saved successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="settings-page">Loading settings...</div>;

    return (
        <div className="settings-page">
            <div className="settings-card">
                <h1>Organization Settings</h1>
                <p>Manage your inventory preferences.</p>

                <form onSubmit={handleSave}>
                    <label htmlFor="threshold">
                        Default Low Stock Threshold
                    </label>

                    <input
                        id="threshold"
                        type="number"
                        min="0"
                        step="1"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                    />

                    <small>
                        Products with stock at or below this quantity will
                        be considered low stock when no product-specific
                        threshold is configured.
                    </small>

                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Settings;
