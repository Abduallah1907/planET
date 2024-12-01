import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import WishlistCard from "../components/Cards/WishlistCard"; // Create a WishlistCard component if it doesn't already exist
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { TouristService } from "../services/TouristService";
import { IProduct } from "../types/IProduct";
import { FileService } from "../services/FileService";

// interface Product {
//   name: string;
//   id: string;
//   average_rating: number;
//   Reviews: number;
//   sales: number;
//   quantity: number;
//   price: number;
//   description: string;
//   isActiveArchive: boolean;
//   image?: string;
//   createdAt: Date;
//   updatedAt: Date;
//   onChange?: () => void;
//   onClick?: () => void;
//   isSeller: boolean;
//   isAdmin: boolean; // Check if the user is the seller
// }

const WishlistPage: React.FC = () => {
  // const wishlist = useAppSelector((state) => state.wishlist); // Adjust to use wishlist state
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  // const wishlistItems: Product[] = wishlist.products;

  const viewMyWishlist = async () => {
    const wish = await TouristService.viewWishlist(user.email);
    console.log(wish.data);
    const productsWithImages = await Promise.all(
      wish.data.map(async (product: IProduct) => {
        if (product.image) {
          const file = await FileService.downloadFile(product.image);
          const url = URL.createObjectURL(file);
          return { ...product, image: url };
        }
        return product;
      })
    );
    setWishlist(productsWithImages);
  };

  useEffect(() => {
    viewMyWishlist();
  }, []);

  return (
    <div className="wishlist-page p-3">
      <Row className="justify-content-center my-5">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            My Wishlist
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={10}>
          {wishlist.map((product: any) => (
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
