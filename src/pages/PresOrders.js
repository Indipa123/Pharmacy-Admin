import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const PresOrders = () => {
    const [presOrders, setPresOrders] = useState([]);
    const [formData, setFormData] = useState({
        pres_status: 'pending'
    });
    const [orderFormData, setOrderFormData] = useState({
        pres_id: '',
        user_email: '',
        medications: '',
        total: ''
    });
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedUserEmail, setSelectedUserEmail] = useState('');

    useEffect(() => {
        fetchPresOrders();
    }, []);

    const fetchPresOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/orders/pres');
            if (response.status === 200) {
                setPresOrders(response.data);
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching prescription orders:', error.message || error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleOrderChange = (e) => {
        const { name, value } = e.target;
        setOrderFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingOrderId) {
                await axios.put(`http://localhost:3000/api/orders/pres/${editingOrderId}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Prescription order updated');

                setPresOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === editingOrderId ? { ...order, ...formData } : order
                    )
                );
            }
            setFormData({
                pres_status: 'pending'
            });
            setEditingOrderId(null);
        } catch (error) {
            console.error('Error updating prescription order:', error);
        }
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:3000/api/orders/presorders/create', orderFormData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Order created');
            setOrderFormData({
                pres_id: '',
                user_email: '',
                medications: '',
                total: ''
            });
            fetchPresOrders(); // Refresh the prescription orders table
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleEdit = (order) => {
        setFormData({
            pres_status: order.pres_status
        });
        setEditingOrderId(order.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/orders/pres/${id}`);
            console.log('Prescription order deleted');
            setPresOrders(prevOrders => prevOrders.filter(order => order.id !== id));
        } catch (error) {
            console.error('Error deleting prescription order:', error);
        }
    };

    const handleImageClick = (pres_image) => {
        setSelectedImage(`data:image/jpeg;base64,${pres_image}`);
    };

    const handleCreateOrder = (pres_id, user_email) => {
        setSelectedUserEmail(user_email);
        setOrderFormData(prevState => ({
            ...prevState,
            pres_id,
            user_email
        }));
    };

    const handleClose = () => {
        setSelectedImage(null);
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

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <h2>Prescription Orders</h2>
            <p>Manage your pharmacy prescription orders here.</p>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>User Name</th>
                        <th style={thStyle}>User Email</th>
                        <th style={thStyle}>Doctor Name</th>
                        <th style={thStyle}>Notes</th>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Prescription Image</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {presOrders.map((order) => (
                        <tr key={order.id}>
                            <td style={tdStyle}>{order.name}</td>
                            <td style={tdStyle}>{order.user_email}</td>
                            <td style={tdStyle}>{order.doctor_name}</td>
                            <td style={tdStyle}>{order.notes}</td>
                            <td style={tdStyle}>{order.date}</td>
                            <td style={tdStyle}>{order.pres_status}</td>
                            <td style={tdStyle}>
                                {order.pres_image ? (
                                    <img
                                        src={`data:image/jpeg;base64,${order.pres_image}`}
                                        alt="Prescription"
                                        width="50"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleImageClick(order.pres_image)}
                                    />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td>
                            <td style={tdStyle}>
                                <button style={buttonStyle} onClick={() => handleEdit(order)}>Edit</button>
                                <button style={buttonStyle} onClick={() => handleDelete(order.id)}>Delete</button>
                                <button style={buttonStyle} onClick={() => handleCreateOrder(order.id, order.user_email)}>Create Order</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>{editingOrderId ? "Edit Prescription Order" : "Update Prescription Status"}</h3>
            <form onSubmit={handleSubmit}>
                <select name="pres_status" value={formData.pres_status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="upload a real prescription">Upload a Real Prescription</option>
                    <option value="processed">Processed</option>
                </select>
                <button type="submit">{editingOrderId ? "Update Prescription Order" : "Update Prescription Order"}</button>
            </form>

            <h3>Create Order</h3>
            <form onSubmit={handleOrderSubmit}>
                <input
                    type="hidden"
                    name="pres_id"
                    value={orderFormData.pres_id}
                />
                <input
                    type="email"
                    name="user_email"
                    value={orderFormData.user_email}
                    style={{ width: '300px' }}
                    readOnly
                />
                <input
                    type="text"
                    name="medications"
                    placeholder="Add Medications"
                    value={orderFormData.medications}
                    onChange={handleOrderChange}
                    required
                />
                <input
                    type="number"
                    name="total"
                    placeholder="Total"
                    value={orderFormData.total}
                    onChange={handleOrderChange}
                    required
                />
                <button type="submit">Create Order</button>
            </form>

            <Modal
                open={!!selectedImage}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    {selectedImage && (
                        <TransformWrapper>
                            <TransformComponent>
                                <img
                                    src={selectedImage}
                                    alt="Prescription"
                                    style={{ width: '100%' }}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default PresOrders;