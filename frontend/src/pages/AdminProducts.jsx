import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const API_URL = 'https://drink-ordering-system-u8uk.onrender.com';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '', price: '', stock_quantity: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/products/${formData.id}`, {
          name: formData.name,
          price: parseFloat(formData.price)
        });
      } else {
        await axios.post(`${API_URL}/products`, {
          name: formData.name,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity) || 0
        });
      }
      setFormData({ id: null, name: '', price: '', stock_quantity: '' });
      setIsEditing(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product', error);
    }
  };

  const handleEdit = (product) => {
    setFormData({ id: product.id, name: product.name, price: product.price, stock_quantity: product.stock_quantity });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product', error);
      }
    }
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h2>Products Management</h2>
        <p>Add, edit, or remove drinks from your menu.</p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Drink Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="e.g. Iced Vanilla Latte"
            />
          </div>
          <div className="form-group">
            <label>Price ($)</label>
            <input 
              type="number" 
              step="0.01"
              className="input-field" 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
              placeholder="0.00"
            />
          </div>
          {!isEditing && (
            <div className="form-group">
              <label>Initial Stock (Optional)</label>
              <input 
                type="number" 
                className="input-field" 
                value={formData.stock_quantity}
                onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                placeholder="0"
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
          {isEditing && (
            <button 
              type="button" 
              className="btn btn-danger" 
              style={{ marginLeft: '1rem' }}
              onClick={() => {
                setIsEditing(false);
                setFormData({ id: null, name: '', price: '', stock_quantity: '' });
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="glass-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td>
                    <button className="btn" style={{ background: 'transparent', color: 'var(--accent-primary)', padding: '0.5rem' }} onClick={() => handleEdit(product)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="btn" style={{ background: 'transparent', color: 'var(--danger)', padding: '0.5rem' }} onClick={() => handleDelete(product.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No products found. Add one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
