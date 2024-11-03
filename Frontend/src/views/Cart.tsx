import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import CartCard from "../components/Cards/CartCard";
import { useAppSelector } from "../store/hooks";


interface Product {
  id: any;
    name: string;
    price: number;
    description: string;
    image: any;
}
interface CartItem {
  product: Product;
  quantity: number;
}

const CartPage: React.FC = () => {
  // Dummy data for two cart items
  const cart = useAppSelector((state)=>state.cart)
  const cartItems: CartItem[] = cart.products;

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
          {cartItems.map((item, index) => (
            <CartCard
              index={index}
              key={item.product.id}
              id={item.product.id}
              name={item.product.name}
              price={item.product.price}
              description={item.product.description}
              quantity={item.quantity}
              image={item.product.image}            />
          ))}
        </Col>

        {/* Right Column: Subtotal and Promo Code */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5>Your Subtotal</h5>
              <h4 className="my-3">${cart.total.toFixed(2)}</h4>
              <Button variant="main-inverse" className="w-100 mb-4">Confirm Order</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
