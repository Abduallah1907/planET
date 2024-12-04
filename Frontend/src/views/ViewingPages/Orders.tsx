import React from "react";
import { Container, Row, Nav } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import "./switch.css";

const Orders: React.FC = () => {
    return (
        <Container className="profile-form-container">
            <Row className="align-items-center mb-4"></Row>
            <Nav className="custom-tabs" defaultActiveKey="/Orders/Past">
                <Nav.Item>
                    <Nav.Link as={NavLink} to="/Orders/Past" className="tab-link">
                        Past Orders
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={NavLink} to="/Orders/Active" className="tab-link">
                        Active Orders
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <Outlet />
        </Container>
    );
};

export default Orders;
