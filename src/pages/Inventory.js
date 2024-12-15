import React, { useState, useEffect } from "react";
import axios from "axios";

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        stock: '',
        price: '',
        image: ''
    });

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
            const response = await axios.post('http://localhost:3000/api/products/add', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Product added:', response.data);
            setFormData({
                name: '',
                category: '',
                stock: '',
                price: '',
                image: ''
            });
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
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
                    type="file"
                    name="image"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Add Product</button>
            </form>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Stock</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td style={tdStyle}>{product.name}</td>
                            <td style={tdStyle}>{product.category}</td>
                            <td style={tdStyle}>{product.stock}</td>
                            <td style={tdStyle}>${product.price}</td>
                            <td style={tdStyle}>
                                {product.image && (
                                    <img
                                        src={`data:image/jpeg;base64,${product.image}`}
                                        alt={product.name}
                                        width="50"
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inventory;
