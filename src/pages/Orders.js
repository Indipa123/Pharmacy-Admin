import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        user_email: '',
        total: '',
        order_status: 'pending',
        payment_method: '',
        items: ''
    });
    const [editingOrderId, setEditingOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/orders/orders');
            if (response.status === 200) {
                setOrders(response.data);
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching orders:', error.message || error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:3000/api/orders/orders/${orderId}`, { order_status: newStatus }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Order status updated');

            // Update local state for instant UI feedback
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, order_status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingOrderId) {
                await axios.put(`http://localhost:3000/api/orders/orders/${editingOrderId}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Order updated');

                // Update local state after editing
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === editingOrderId ? { ...order, ...formData } : order
                    )
                );
            }
            setFormData({
                user_email: '',
                total: '',
                order_status: 'pending',
                payment_method: '',
                items: ''
            });
            setEditingOrderId(null);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleEdit = (order) => {
        setFormData({
            user_email: order.user_email,
            total: order.total,
            order_status: order.order_status,
            payment_method: order.payment_method,
            items: order.items
        });
        setEditingOrderId(order.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/orders/orders/${id}`);
            console.log('Order deleted');
            setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
        } catch (error) {
            console.error('Error deleting order:', error);
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

    const sortedOrders = [...orders].sort((a, b) => {
        if (a.order_status === 'processing' && b.order_status !== 'processing') return -1;
        if (a.order_status === 'completed' && b.order_status !== 'completed') return -1;
        if (a.order_status !== 'processing' && b.order_status === 'processing') return 1;
        if (a.order_status !== 'completed' && b.order_status === 'completed') return 1;
        return 0;
    });

    return (
        <div>
            <h2>Orders</h2>
            <p>Manage your pharmacy orders here.</p>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>User Name</th>
                        <th style={thStyle}>User Email</th>
                        <th style={thStyle}>Total</th>
                        <th style={thStyle}>Order Status</th>
                        <th style={thStyle}>Payment Method</th>
                        <th style={thStyle}>Items</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedOrders.map((order) => (
                        <tr key={order.id}>
                            <td style={tdStyle}>{order.name}</td>
                            <td style={tdStyle}>{order.user_email}</td>
                            <td style={tdStyle}>RS.{order.total}</td>
                            <td style={tdStyle}>
                                <select
                                    value={order.order_status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </td>
                            <td style={tdStyle}>{order.payment_method}</td>
                            <td style={tdStyle}>{order.items}</td>
                            <td style={tdStyle}>
                                <button style={buttonStyle} onClick={() => handleEdit(order)}>Edit</button>
                                <button onClick={() => handleDelete(order.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>{editingOrderId ? "Edit Order" : "Update Order Status"}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    placeholder="User Email"
                    style={{ width: '300px' }}
                    required
                />
                <select name="order_status" value={formData.order_status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                </select>
                <button type="submit">{editingOrderId ? "Update Order" : "Update Order"}</button>
            </form>
        </div>
    );
};

export default Orders;
