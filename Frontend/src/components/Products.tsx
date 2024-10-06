import React, { useState } from "react";
import "./Products.css"; // Make sure this includes your CSS
import Logo from "./../assets/person-circle.svg";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Sidebar from "./SideBar/Sidebar";
import { useAppSelector,useAppDispatch } from "../store/hooks";
import { toggleSidebar } from "../store/sidebarSlice";


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Advertiser: React.FC = () => {
  // Dummy product data
  const products: Product[] = [
    {
      id: 1,
      name: "Product 1",
      description: "This is the description of product 1.",
      price: 99.99,
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Product 2",
      description: "This is the description of product 2.",
      price: 129.99,
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Product 3",
      description: "This is the description of product 3.",
      price: 79.99,
      imageUrl: "https://via.placeholder.com/150",
    },
  ];

  const isSidebarOpen = useAppSelector((state) => state.sidebar.isOpen)
  const dispatch = useAppDispatch()

  return (
    <div className="product-cards-container">
      <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={()=>dispatch(toggleSidebar())}
          navItems={[
            { path: "/dashboard", label: "Dashboard" },
            { path: "/products", label: "Products" },
          ]}
        />
      </div>
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <Row className="align-items-center mb-4">
          <Col xs={9} className="text-left">
            <h2 className="my-profile-heading">Products</h2>
          </Col>
          <Col xs={1} className="text-center">
            <img
              src={Logo}
              width="70"
              height="50"
              className="align-top logo"
              alt="Company Logo"
            />
          </Col>
        </Row>
        <Container>
          <Row>
            {products.map((product) => (
              <Col md={4} key={product.id} className="mb-4">
                <Card className="product-card">
                  <Card.Img
                    variant="top"
                    src={product.imageUrl}
                    alt={product.name}
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <h5>${product.price.toFixed(2)}</h5>
                    <Button variant="primary">Buy Now</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Advertiser;
