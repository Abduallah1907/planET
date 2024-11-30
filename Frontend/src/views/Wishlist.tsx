import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import WishlistCard from "../components/Cards/WishlistCard"; // Create a WishlistCard component if it doesn't already exist
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

const WishlistPage: React.FC = () => {
  const wishlist = useAppSelector((state) => state.wishlist); // Adjust to use wishlist state
  const navigate = useNavigate();
  const wishlistItems: Product[] = wishlist.products;

  return (
    <div className="wishlist-page p-3">
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            My Wishlist
          </h1>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          {wishlistItems.map((product) => (
            <WishlistCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
              image={product.image}
              //onAddToCart={() => navigate("/cart")} // Example handler
              //onRemoveFromWishlist={() => {
              /* Dispatch remove from wishlist action */
              //}}
            />
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default WishlistPage;
