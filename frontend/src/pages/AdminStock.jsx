import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AdminStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stock', error);
      setLoading(false);
    }
  };

  const handleStockChange = (id, newQuantity) => {
    setProducts(products.map(p => p.id === id ? { ...p, draftStock: newQuantity } : p));
  };

  const handleUpdateStock = async (product) => {
    const qty = parseInt(product.draftStock !== undefined ? product.draftStock : product.stock_quantity);
    if (isNaN(qty)) return;

    try {
      await axios.put(`${API_URL}/stock/${product.id}`, {
        stock_quantity: qty
      });
      fetchProducts(); // Refresh data to show success and remove draft state
    } catch (error) {
      console.error('Error updating stock', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h2>Stock Management</h2>
        <p>Monitor your inventory and update quantities.</p>
      </div>

      <div className="glass-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Update Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const isLow = product.stock_quantity < 5;
                const draftVal = product.draftStock !== undefined ? product.draftStock : product.stock_quantity;
                const hasChanged = draftVal !== product.stock_quantity;

                return (
                  <tr key={product.id} className={isLow ? "low-stock-row" : ""}>
                    <td style={{ fontWeight: '500' }}>{product.name}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td style={{ fontWeight: 'bold', color: isLow ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {product.stock_quantity}
                    </td>
                    <td>
                      {isLow ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">Sufficient</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="number"
                          className="input-field"
                          style={{ width: '80px', padding: '0.4rem' }}
                          value={draftVal}
                          onChange={(e) => handleStockChange(product.id, e.target.value)}
                        />
                        {hasChanged && (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 0.8rem' }}
                            onClick={() => handleUpdateStock(product)}
                          >
                            <Save size={16} /> Save
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No products found in inventory.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStock;
