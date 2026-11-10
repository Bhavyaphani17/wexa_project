import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await api.post('/auth/login', form)
            const data = response.data

            localStorage.setItem('token', data.token)
            localStorage.setItem('email', data.email)
            localStorage.setItem('organizationName', data.organizationName)

            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>StockFlow</h1>
                <p className="subtitle">Welcome back! Sign in to your account.</p>

                {error && <p className="error">{error}</p>}

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Login'}
                </button>

                <p className="auth-link">
                    Don't have an account? <Link to="/signup">Create account</Link>
                </p>
            </form>
        </div>
    )
}