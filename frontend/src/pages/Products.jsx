
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const emptyForm = {
    name: '',
    sku: '',
    description: '',
    quantity: 0,
    costPrice: '',
    sellingPrice: '',
    lowStockThreshold: '',
}

export default function Products() {
    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [defaultThreshold, setDefaultThreshold] = useState(5)
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const loadProducts = async () => {
        try {
            const [productsResponse, settingsResponse] = await Promise.all([
                api.get('/products'),
                api.get('/settings')
            ])

            setProducts(productsResponse.data)
            setDefaultThreshold(
                settingsResponse.data.defaultLowStockThreshold ?? 5
            )
            setError('')
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load products.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const resetForm = () => {
        setForm(emptyForm)
        setEditingId(null)
        setShowForm(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const payload = {
            ...form,
            quantity: Number(form.quantity),
            costPrice: form.costPrice === '' ? null : Number(form.costPrice),
            sellingPrice: form.sellingPrice === '' ? null : Number(form.sellingPrice),
            lowStockThreshold:
                form.lowStockThreshold === '' ? null : Number(form.lowStockThreshold),
        }

        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, payload)
                setSuccess('Product updated successfully!')
            } else {
                await api.post('/products', payload)
                setSuccess('Product added successfully!')
            }

            resetForm()
            await loadProducts()
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to save product. Check your inputs.')
        }
    }

    const handleEdit = (product) => {
        setForm({
            name: product.name,
            sku: product.sku,
            description: product.description || '',
            quantity: product.quantity,
            costPrice: product.costPrice ?? '',
            sellingPrice: product.sellingPrice ?? '',
            lowStockThreshold: product.lowStockThreshold ?? 5,
        })

        setEditingId(product.id)
        setShowForm(true)
        setError('')
        setSuccess('')
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return

        try {
            await api.delete(`/products/${id}`)
            setSuccess('Product deleted successfully!')
            await loadProducts()
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete product.')
        }
    }

    const filteredProducts = products.filter((product) =>
        `${product.name} ${product.sku}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    if (loading) return <p style={{ padding: 30 }}>Loading products...</p>

    return (
        <div className="products-page">
            <div className="products-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your organization's inventory.</p>
                </div>

                <button onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>

            {error && <p className="product-error">{error}</p>}
            {success && <p className="product-success">{success}</p>}

            <div className="products-toolbar">
                <input
                    type="text"
                    placeholder="Search by product name or SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    onClick={() => {
                        resetForm()
                        setShowForm(true)
                        setError('')
                        setSuccess('')
                    }}
                >
                    + Add Product
                </button>
            </div>

            {showForm && (
                <form className="product-form" onSubmit={handleSubmit}>
                    <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>

                    <div className="product-form-grid">
                        <label>
                            Product Name *
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            SKU *
                            <input
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Quantity *
                            <input
                                type="number"
                                name="quantity"
                                min="0"
                                value={form.quantity}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Low Stock Threshold
                            <input
                                type="number"
                                name="lowStockThreshold"
                                value={form.lowStockThreshold}
                                onChange={handleChange}
                                min="0"
                                placeholder="Use organization default"
                            />
                        </label>

                        <label>
                            Cost Price
                            <input
                                type="number"
                                name="costPrice"
                                min="0"
                                step="0.01"
                                value={form.costPrice}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Selling Price
                            <input
                                type="number"
                                name="sellingPrice"
                                min="0"
                                step="0.01"
                                value={form.sellingPrice}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <label className="description-field">
                        Description
                        <textarea
                            name="description"
                            maxLength="500"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </label>

                    <div className="form-actions">
                        <button type="submit">
                            {editingId ? 'Update Product' : 'Save Product'}
                        </button>
                        <button type="button" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="products-table-wrapper">
                <table className="products-table">
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Cost Price</th>
                        <th>Selling Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="empty-products">
                                No products found. Add your first product!
                            </td>
                        </tr>
                    ) : (
                        filteredProducts.map((product) => {
                            const threshold = product.lowStockThreshold ?? defaultThreshold
                            const isLowStock = product.quantity <= threshold

                            return (
                                <tr key={product.id}>
                                    <td>
                                        <strong>{product.name}</strong>
                                        <small>{product.description}</small>
                                    </td>
                                    <td>{product.sku}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.costPrice ?? '-'}</td>
                                    <td>{product.sellingPrice ?? '-'}</td>
                                    <td>
                      <span className={isLowStock ? 'stock-low' : 'stock-good'}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(product)}>
                                            Edit
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
