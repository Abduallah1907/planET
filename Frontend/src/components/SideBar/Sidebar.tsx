import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom"; // If you're using react-router for navigation
import "./Sidebar.css"; // Create a corresponding CSS file for styles

interface NavItem {
  path: string;
  label: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, navItems }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <Nav className="flex-column">
        {navItems.map((item, index) => (
          <Nav.Item key={index}>
            <Link to={item.path} className="nav-link" onClick={onClose}>
              {item.label}
            </Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
