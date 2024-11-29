import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Nav,
} from "react-bootstrap";
import "../mybookings.css";
import { NavLink, Outlet } from "react-router-dom";

const Orders: React.FC = () => {
    return (
        <Container className="profile-form-container">
            <Row className="align-items-center mb-4">
            </Row>
            <Nav className="bookingTabs" defaultActiveKey="/Orders/Past">
                <Nav.Item>
                    <Nav.Link as={NavLink} to="/Orders/Past">
                        Past Orders
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={NavLink} to="/Orders/Active">
                        Active Orders
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <Outlet />
        </Container>
    );
};

export default Orders;
