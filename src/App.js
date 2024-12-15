import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Customer from "./pages/Customer";

const App = () => {
    const [selectedPage, setSelectedPage] = useState("Dashboard");

    const renderPage = () => {
        switch (selectedPage) {
            case "Dashboard":
                return <Dashboard />;
            case "Orders":
                return <Orders />;
            case "Inventory":
                return <Inventory />;
            case "Customer":
                return <Customer />;
            default:
                return <Dashboard />;    
        }
    };

    return (
        <Box display="flex">
            <Sidebar onSelect={setSelectedPage} />
            <Box flex={1} display="flex" flexDirection="column">
                <Navbar />
                <Box p={2}>{renderPage()}</Box>
            </Box>
        </Box>
    );
};

export default App;
