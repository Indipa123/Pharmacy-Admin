import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CustomerIcon from "@mui/icons-material/PeopleAlt";

const Sidebar = () => {
    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { text: "Orders", icon: <ShoppingCartIcon />, path: "/orders" },
        { text: "Customers", icon: <CustomerIcon />, path: "/customer" },
        { text: "Inventory", icon: <InventoryIcon />, path: "/inventory" },
      //  { text: "Prescription Orders", icon: <ShoppingCartIcon />, path: "/prescription-orders" },
    ];

    return (
        <div style={{ width: 240, background: "#f5f5f5", height: "100vh" }}>
            <List>
                {menuItems.map((item) => (
                    <ListItem button component={Link} to={item.path} key={item.text}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Sidebar;