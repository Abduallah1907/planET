import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import CartCard from "../components/Cards/CartCard";

interface CartItem {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
  image: string;
}

const CartPage: React.FC = () => {
  // Dummy data for two cart items
  const cartItems: CartItem[] = [
    {
      id: 1,
      name: "Smashed Avo",
      price: 20.0,
      description: "Delicious smashed avocado on toast.",
      quantity: 1,
      image: "https://via.placeholder.com/250x250",
    },
    {
      id: 2,
      name: "Pancakes",
      price: 25.0,
      description: "Fluffy pancakes with maple syrup.",
      quantity: 1,
      image: "https://via.placeholder.com/250x250",
    },
  ];

  // Calculate subtotal based on dummy data
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-page p-3">
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            Your Cart
          </h1>
        </Col>
      </Row>
      <Row>
        {/* Left Column: List of Purchased Products */}
        <Col md={8}>
          {cartItems.map((item) => (
            <CartCard
              key={item.id}
              id={item.id.toString()}
              name={item.name}
              price={item.price}
              description={item.description}
              quantity={item.quantity}
              image={item.image}            />
          ))}
        </Col>

        {/* Right Column: Subtotal and Promo Code */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5>Your Subtotal</h5>
              <h4 className="my-3">${subtotal.toFixed(2)}</h4>
              <Button variant="main-inverse" className="w-100 mb-4">Confirm Order</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
