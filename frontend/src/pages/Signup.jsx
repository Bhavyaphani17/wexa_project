import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Signup() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: '',
        password: '',
        organizationName: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password.length < 8) {
            setError('Password must contain at least 8 characters.')
            return
        }

        setLoading(true)

        try {
            const response = await api.post('/auth/signup', form)
            const data = response.data

            localStorage.setItem('token', data.token)
            localStorage.setItem('email', data.email)
            localStorage.setItem('organizationName', data.organizationName)

            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>StockFlow</h1>
                <p className="subtitle">Create your organization account.</p>

                {error && <p className="error">{error}</p>}

                <label>Organization Name</label>
                <input
                    type="text"
                    name="organizationName"
                    placeholder="Enter organization name"
                    value={form.organizationName}
                    onChange={handleChange}
                    maxLength={100}
                    required
                />

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
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="auth-link">
                    Already registered? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    )
}