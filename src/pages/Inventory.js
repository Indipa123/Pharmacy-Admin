import React, { useState, useEffect } from "react";
import axios from "axios";

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        stock: '',
        price: '',
        image: '',
        size: '',
        prescription: 'no need'
    });
    const [editingProductId, setEditingProductId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/products/');
            if (response.status === 200) {
                setProducts(response.data);
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching products:', error.message || error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prevState => ({
                    ...prevState,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(files[0]);
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            if (editingProductId) {
                await axios.put(`http://localhost:3000/api/products/${editingProductId}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Product updated');
            } else {
                await axios.post('http://localhost:3000/api/products/add', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Product added');
            }
            setFormData({
                name: '',
                category: '',
                stock: '',
                price: '',
                image: '',
                size: '',
                prescription: 'no need'
            });
            setEditingProductId(null);
            fetchProducts();
        } catch (error) {
            console.error('Error adding/updating product:', error);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            category: product.category,
            stock: product.stock,
            price: product.price,
            image: '',
            size: product.size,
            prescription: product.prescription
        });
        setEditingProductId(product.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/products/${id}`);
            console.log('Product deleted');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
    };

    const thStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        backgroundColor: '#f2f2f2'
    };

    const tdStyle = {
        border: '1px solid #ddd',
        padding: '8px'
    };

    const buttonStyle = {
        marginRight: '10px'
    };

    return (
        <div>
            <h2>Inventory</h2>
            <p>Manage your pharmacy inventory here.</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="size"
                    placeholder="Size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                />
                <select
                    name="prescription"
                    placeholder="Prescription"
                    value={formData.prescription}
                    onChange={handleChange}
                    required
                >
                    <option value="no need">No Need</option>
                    <option value="need">Need</option>
                </select>
                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                />
                {formData.image && (
                    <img
                        src={formData.image}
                        alt="Product Preview"
                        width="100"
                    />
                )}
                <button type="submit">{editingProductId ? 'Update Product' : 'Add Product'}</button>
            </form>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Stock</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Size</th>
                        <th style={thStyle}>Prescription</th>
                        <th style={thStyle}>Image</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td style={tdStyle}>{product.name}</td>
                            <td style={tdStyle}>{product.category}</td>
                            <td style={tdStyle}>{product.stock}</td>
                            <td style={tdStyle}>${product.price}</td>
                            <td style={tdStyle}>{product.size}</td>
                            <td style={tdStyle}>{product.prescription === 'need' ? 'Need' : 'No Need'}</td>
                            <td style={tdStyle}>
                                {product.image && (
                                    <img
                                        src={`data:image/jpeg;base64,${product.image}`}
                                        alt={product.name}
                                        width="50"
                                    />
                                )}
                            </td>
                            <td style={tdStyle}>
                                <button style={buttonStyle} onClick={() => handleEdit(product)}>Edit</button>
                                <button onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inventory;