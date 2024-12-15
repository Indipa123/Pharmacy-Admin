import React, { useState, useEffect } from "react";
import axios from "axios";

const Customer = () => {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/users/admin/user-details", {
                params: { email },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    return (
        <div>
            <h2>Customer</h2>
            <p>Manage your pharmacy Customers here.</p>

            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <input
                    type="email"
                    placeholder="Enter email to search"
                    value={email}
                    onChange={handleEmailChange}
                    style={{
                        padding: "10px",
                        width: "300px",
                        marginRight: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Search
                </button>
            </form>

            {users.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Image</th>
                            <th style={thStyle}>Birthday</th>
                            <th style={thStyle}>Contact</th>
                            <th style={thStyle}>Address</th>
                            <th style={thStyle}>Blood Type</th>
                            <th style={thStyle}>Gender</th>
                            <th style={thStyle}>Weight</th>
                            <th style={thStyle}>Work</th>
                            <th style={thStyle}>Height</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.email}>
                                <td style={tdStyle}>{user.name}</td>
                                <td style={tdStyle}>{user.email}</td>
                                <td style={tdStyle}>
                                    {user.image ? (
                                        <img
                                            src={`data:image/jpeg;base64,${user.image}`}
                                            alt={user.name}
                                            width="50"
                                            height="50"
                                            style={{ borderRadius: "50%" }}
                                        />
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td style={tdStyle}>{user.birthday}</td>
                                <td style={tdStyle}>{user.contact}</td>
                                <td style={tdStyle}>{user.address}</td>
                                <td style={tdStyle}>{user.blood_type}</td>
                                <td style={tdStyle}>{user.gender}</td>
                                <td style={tdStyle}>{user.weight}</td>
                                <td style={tdStyle}>{user.work}</td>
                                <td style={tdStyle}>{user.height}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: "center" }}>No users found.</p>
            )}
        </div>
    );
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

export default Customer;