import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom"; // If you're using react-router for navigation
import "./Sidebar.css"; // Create a corresponding CSS file for styles
import { IconType } from "react-icons";

interface NavItem {
  icon?: IconType;
  path?: string;
  label: string;
  isModal?: boolean;
  modalComponent?: React.FC<any>;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, navItems }) => {
  const [activeModal, setActiveModal] = React.useState<React.FC<any> | null>(null);

  const handleModalClose = () => {
    setActiveModal(null);
    onClose();
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <Nav className="flex-column">
        {navItems.map((item, index) => (
          <Nav.Item key={index}>
            {item.path ? (
              <Link to={item.path} className="nav-link d-flex" onClick={onClose}>
                {item.icon && <span className="me-2 d-flex align-items-center">{React.createElement(item.icon)}</span>}
                {item.label}
              </Link>
            ) : item.isModal && item.modalComponent ? (
              <a
                href="#"
                className="nav-link d-flex"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveModal(() => item.modalComponent || null); // Assigning the component directly
                }}
              >
                {item.icon && <span className="me-2 d-flex align-items-center">{React.createElement(item.icon)}</span>}
                {item.label}
              </a>
            ) : null}
          </Nav.Item>
        ))}
      </Nav>
      {activeModal &&
        React.createElement(activeModal, {
          show: true, // Pass the required "show" prop
          onHide: handleModalClose, // Pass the required "onHide" prop
        })}
    </div>
  );
};

export default Sidebar;