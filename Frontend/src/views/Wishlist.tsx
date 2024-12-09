import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import WishlistCard from "../components/Cards/WishlistCard"; // Create a WishlistCard component if it doesn't already exist
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { TouristService } from "../services/TouristService";
import { IProduct } from "../types/IProduct";
import { FileService } from "../services/FileService";
import { setWishlist } from "../store/wishlistSlice";

const WishlistPage: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const wishlist = useAppSelector((state) => state.wishlist);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const wishlistItems: IProduct[] = wishlistState.products;

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
    dispatch(setWishlist(productsWithImages));
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
        {wishlist.products.map((product: any) => (
          <Col md={5}>
            <WishlistCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              description={product.description}
              image={product.image}
            //onAddToCart={() => navigate("/cart")} // Example handler
            //onRemoveFromWishlist={() => {
            /* Dispatch remove from wishlist action */
            //}}
            />
          </Col>
        ))}
    </Row>
    </div >
  );
};

export default WishlistPage;
