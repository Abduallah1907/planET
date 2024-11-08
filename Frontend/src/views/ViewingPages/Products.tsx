import React, { useEffect, useState } from "react";
import ProductCard from "../../components/Cards/ProductCard";
import FilterBy from "../../components/FilterBy/FilterBy";
import { Col, Row, Container, Form, InputGroup, Button } from "react-bootstrap";
import { BiSort } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { IProduct } from "../../types/IProduct";
import { ProductService } from "../../services/ProductService";
import { FileService } from "../../services/FileService";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [filtercomponent, setfilterComponents] = React.useState({});
  const [sortBy, setSortBy] = useState("topPicks");
  const [filter, setFilter] = React.useState({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Function to sort products based on selected criteria
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "topPicks":
        return b.average_rating - a.average_rating;
      case "priceHighToLow":
        return (b.price ?? 0) - (a.price ?? 0);
      case "priceLowToHigh":
        return (a.price ?? 0) - (b.price ?? 0);
      case "ratingHighToLow":
        return (b.average_rating ?? 0) - (a.average_rating ?? 0);
      case "ratingLowToHigh":
        return (a.average_rating ?? 0) - (b.average_rating ?? 0);
      default:
        return 0;
    }
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  const getProducts = async () => {
    const productsData = await ProductService.getAllProducts(); // Use getAllProducts here
    const productsWithImages = await Promise.all(
      productsData.data.map(async (product: IProduct) => {
        if (product.image) {
          const file = await FileService.downloadFile(product.image);
          const url = URL.createObjectURL(file);
          return { ...product, image: url };
        }
        return product;
      })
    );
    setProducts(productsWithImages);
  };
  const getFilteredProducts = async () => {
    const modifiedFilter = { ...filter };
    const productsData = await ProductService.getFilteredProducts(
      modifiedFilter
    );
    const productsWithImages = await Promise.all(
      productsData.data.map(async (product: IProduct) => {
        if (product.image) {
          const file = await FileService.downloadFile(product.image);
          const url = URL.createObjectURL(file);
          return { ...product, image: url };
        }
        return product;
      })
    );
    setProducts(productsWithImages);
  };
  const handleApplyFilters = () => {
    getFilteredProducts();
  };
  const getFilterComponents = async () => {
    const filterData = await ProductService.getFilterComponents();
    setfilterComponents(filterData.data);
  };

  useEffect(() => {
    getProducts();
    getFilterComponents();
  }, []);

  const onFilterChange = (newFilter: { [key: string]: any }) => {
    setFilter(newFilter);
  };

  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            Explore Our Products
          </h1>
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
        <Col
          md={3}
          className="border-bottom pb-2 d-flex flex-column align-items-md-center"
        >
          <Button variant="main-inverse" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <FilterBy
            filterOptions={filtercomponent}
            onFilterChange={onFilterChange}
          />
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
                <option value="ratingHighToLow">Rating: High to Low</option>
                <option value="ratingLowToHigh">Rating: Low to High</option>
              </Form.Select>
            </div>
            {filteredProducts.map((product: IProduct, index) => (
              <Col key={index} xs={12} className="mb-4 ps-0">
                <ProductCard
                  id={product._id}
                  name={product.name}
                  average_rating={product.average_rating}
                  quantity={product.quantity}
                  price={product.price}
                  description={product.description}
                  sales={product.sales}
                  Reviews={product.reviews_count}
                  createdAt={
                    product.createdAt ? new Date(product.createdAt) : new Date()
                  }
                  updatedAt={
                    product.updatedAt ? new Date(product.updatedAt) : new Date()
                  }
                  image={product.image}
                  isActiveArchive={product.archieve_flag}
                  isSeller={false}
                  isAdmin={false}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
