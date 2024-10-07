import React, { useState } from "react";
import ProductCard from "../components/Cards/ProductCard"; 
import FilterBy from "../components/FilterBy/FilterBy";
import { Col, Row, Container, Form, InputGroup } from "react-bootstrap";
import { BiSort } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

const productData = [
  {
    Name: "Smartphone",
    Price: 700,
    RatingVal: 4.5,
    Reviews: 200,
    description: "Latest model with advanced features.",
    seller: "TechStore",
    imageUrl: "https://via.placeholder.com/250x250",
    isActive: true,
    isBooked: false,
  },
  {
    Name: "Laptop",
    Price: 1250,
    RatingVal: 4.7,
    Reviews: 320,
    description: "High-performance laptop with sleek design.",
    seller: "CompWorld",
    imageUrl: "https://via.placeholder.com/250x250",
    isActive: true,
    isBooked: true,
  },
  {
    Name: "Headphones",
    Price: 190,
    RatingVal: 4.3,
    Reviews: 150,
    description: "Noise-cancelling wireless headphones.",
    seller: "AudioMania",
    imageUrl: "https://via.placeholder.com/250x250",
    isActive: true,
    isBooked: false,
  },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("topPicks"); // State for sort by selection

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  // Function to sort products based on selected criteria
  const sortedProducts = [...productData].sort((a, b) => {
    switch (sortBy) {
      case "topPicks":
        return b.RatingVal - a.RatingVal;
      case "priceLowToHigh":
        return a.Price - b.Price;
      case "priceHighToLow":
        return b.Price - a.Price;
      case "reviewsLowToHigh":
        return a.Reviews - b.Reviews;
      case "reviewsHighToLow":
        return b.Reviews - a.Reviews;
      default:
        return 0;
    }
  });

  const filteredProducts = sortedProducts.filter((product) =>
    product.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>Explore Our Products</h1>
        </Col>
      </Row>

      <Row className="justify-content-center my-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text
              id="basic-addon1"
              style={{
                backgroundColor: "#F7F7F7",
                borderRadius: "50px 0 0 50px",
                border: "1px solid #D76F30",
              }}
            >
              <FaSearch color="#D76F30" /> {/* Search icon */}
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                border: "1px solid #D76F30",
                borderRadius: "0 50px 50px 0",
                backgroundColor: "#F7F7F7",
                boxShadow: "none",
              }}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col md={3} className="border-bottom pb-2">
          <FilterBy filterOptions={{}} />
        </Col>

        <Col md={9} className="p-3">
          <Row>
            {/* Sort By Section */}
            <div className="sort-btn w-auto d-flex align-items-center">
              <BiSort />
              <Form.Select value={sortBy} onChange={handleSortChange}>
                <option value="topPicks">Our Top Picks</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="reviewsLowToHigh">Reviews: Low to High</option>
                <option value="reviewsHighToLow">Reviews: High to Low</option>
              </Form.Select>
            </div>
            {filteredProducts.map((product, index) => (
              <Col key={index} xs={12} className="mb-4 ps-0">
                <ProductCard
                        Name={product.Name}
                        RatingVal={product.RatingVal}
                        Reviews={product.Reviews}
                        Price={product.Price}
                        description={product.description}
                        seller={product.seller}
                        imageUrl={product.imageUrl}
                        isActive={product.isActive}
                        isBooked={product.isBooked}
                        onChange={() => console.log(`${product.Name} booking status changed`)} id={0} isSeller={true}                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
