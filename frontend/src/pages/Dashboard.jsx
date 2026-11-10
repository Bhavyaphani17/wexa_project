
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [error, setError] = useState('')

    const email = localStorage.getItem('email')
    const organization = localStorage.getItem('organizationName')

    useEffect(() => {
        api.get('/dashboard')
            .then(response => setData(response.data))
            .catch(() => setError('Unable to load dashboard data.'))
    }, [])

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('organizationName')
        navigate('/login')
    }

    if (error) return <p className="dashboard-error">{error}</p>
    if (!data) return <p className="dashboard-loading">Loading dashboard...</p>

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <h1>StockFlow</h1>
                    <p>Smart Inventory Management</p>
                </div>
                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </header>

            <section className="welcome-section">
                <h2>Welcome, {organization || 'User'}! 👋</h2>
                <p>{email}</p>
                <p>Here's what's happening with your inventory today.</p>
            </section>

            <section className="dashboard-stats">
                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <h3>Total Products</h3>
                    <h2>{data.totalProducts}</h2>
                    <p>Products in your inventory</p>
                </div>

                <div className="stat-card">
                    <span className="stat-icon">📊</span>
                    <h3>Total Stock</h3>
                    <h2>{data.totalStock}</h2>
                    <p>Available units</p>
                </div>

                <div className="stat-card low-stock-card">
                    <span className="stat-icon">⚠️</span>
                    <h3>Low Stock Products</h3>
                    <h2>{data.lowStockProducts}</h2>
                    <p>Products need attention</p>
                </div>

                <div className="stat-card">
                    <span className="stat-icon">💰</span>
                    <h3>Inventory Value</h3>
                    <h2>₹{Number(data.inventoryValue).toLocaleString('en-IN')}</h2>
                    <p>Total selling value</p>
                </div>
            </section>

            <section className="dashboard-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <button onClick={() => navigate('/products')}>
                        📦 Manage Products
                    </button>
                    <button onClick={() => navigate('/settings')}>
                        ⚙️ Organization Settings
                    </button>
                </div>
            </section>
        </div>
    )
}
