import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import PresOrders from "./pages/PresOrders";
import Customer from "./pages/Customer";

const App = () => {
    return (
        <Router>
            <Box display="flex">
                <Sidebar />
                <Box flex={1} display="flex" flexDirection="column">
                    <Navbar />
                    <Box p={2}>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/inventory" element={<Inventory />} />
                            <Route path="/prescription-orders" element={<PresOrders />} />
                            <Route path="/customer" element={<Customer />} />
                            <Route path="/" element={<Dashboard />} />
                        </Routes>
                    </Box>
                </Box>
            </Box>
        </Router>
    );
};

export default App;