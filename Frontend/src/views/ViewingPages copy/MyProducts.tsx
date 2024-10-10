import React, { useEffect, useState } from "react";
import ProductCard from "../../components/Cards/ProductCard"; 
import FilterBy from "../../components/FilterBy/FilterBy";
import { Col, Row, Container, Form, InputGroup, Button } from "react-bootstrap";
import { BiSort } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { IProduct } from "../../types/IProduct";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../../services/ProductService";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [products, setProducts] = React.useState<IProduct[]>([])
  const [ filtercomponent, setfilterComponents] = React.useState({})
  const [sortBy, setSortBy] = useState("topPicks"); 
  const [filter,setFilter] = React.useState({});


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Function to sort products based on selected criteria
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "topPicks":
        return b.average_rating - a.average_rating;
      case "priceHighToLow":
        return a.price - b.price;
      case "priceLowToHigh":
        return b.price - a.price;
      case "reviewsLowToHigh":
        return a.reviews - b.reviews;
      case "reviewsHighToLow":
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setProducts(sortedProducts)
  };
  const getProducts = async () => {
    const productsData = await ProductService.getAllProducts();
    setProducts(productsData.data);
  };
  const getFilteredProducts = async () => {
    const modifiedFilter = Object.fromEntries(
      Object.entries(filter).map(([key, value]) =>
        Array.isArray(value) ? [key, value.join(",")] : [key, value]
      )
    );
    const productsData = await ProductService.getFilteredProducts(modifiedFilter);
    setProducts(productsData.data);
  }
  const handleApplyFilters = () => {
    getFilteredProducts();
  }
  const getFilterComponents = async () => {
    const filterData = await ProductService.getFilterComponents();
    setfilterComponents(filterData.data);
  };

  useEffect(() => {
    getProducts();
    getFilterComponents();
  }, []);
  const onProductClick = (name : string) => {
    navigate(`/product/${name}`);
  }

  const onFilterChange = (newFilter: {[key: string]: any;}) => {
    setFilter(newFilter);
  }

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
      <Col md={3} className="border-bottom pb-2 d-flex flex-column align-items-md-center">
          <Button variant="main-inverse" onClick={handleApplyFilters}>Apply Filters</Button>
          <FilterBy filterOptions={filtercomponent} onFilterChange={onFilterChange}/>
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
            {products.map((product:IProduct, index) => (
              <Col key={index} xs={12} className="mb-4 ps-0">
                <ProductCard
                        id={product._id}
                        Name={product.name}
                        average_rating={product.average_rating}
                        quantity={product.quantity}
                        price={product.price}
                        description={product.description}
                        sales={product.sales}
                        Reviews={product.reviews}
                        createdAt={product.createdAt ? new Date(product.createdAt):new Date()}
                        updatedAt={product.updatedAt ? new Date(product.updatedAt):new Date()}
                        imageUrl={product.picture}
                        isActiveArchive={product.archieve_flag}
                        onChange={() => console.log(`${product.name} booking status changed`)}
                        isSeller={true}
                        isAdmin={true}             />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
