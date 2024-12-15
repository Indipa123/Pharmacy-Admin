import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CustomerIcon from "@mui/icons-material/PeopleAlt";


const Sidebar = ({ onSelect }) => {
    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, page: "Dashboard" },
        { text: "Orders", icon: <ShoppingCartIcon />, page: "Orders" },
        { text: "Customers", icon: <CustomerIcon />, page: "Customer" }, // Changed page to "Dashboard"
        { text: "Inventory", icon: <InventoryIcon />, page: "Inventory" },
    ];

    return (
        <div style={{ width: 240, background: "#f5f5f5", height: "100vh" }}>
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text} onClick={() => onSelect(item.page)}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Sidebar;
