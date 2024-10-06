import React, { useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";

interface Listing {
  id: number;
  title: string;
  price: number;
  Date: string;
  Time: string;
  Category: string;
  status: "Inactive" | "Open" | "Closed";
}

const listings: Listing[] = [
  {
    id: 1,
    title: "Barbeque",
    price: 100,
    Category: "Food",
    status: "Open",
    Date: "",
    Time: "",
  },
  {
    id: 2,
    title: "Ahly VS Zamalek Match",
    price: 150,
    Category: "Sport events",
    status: "Closed",
    Date: "",
    Time: "",
  },
  {
    id: 3,
    title: "Amr Diab Concert",
    price: 200,
    Category: "Concert",
    status: "Open",
    Date: "",
    Time: "",
  },
  {
    id: 4,
    title: "Disco",
    price: 250,
    Category: "Party",
    status: "Inactive",
    Date: "",
    Time: "",
  },
  {
    id: 5,
    title: "Grand Bazaar",
    price: 0,
    Category: "Bazaars",
    status: "Open",
    Date: "",
    Time: "",
  },
];

function BookingLayout() {
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const [priceFilter, setPriceFilter] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const handlePriceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseInt(e.target.value, 10);
    setPriceFilter(newPrice);
    filterByPrice(newPrice);
  };

  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCategory = e.target.value;
    setCategoryFilter(selectedCategory);
    filterByCategory(selectedCategory);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
    filterByStatus(selectedStatus);
  };

  const filterByPrice = (price: number) => {
    setFilteredListings(listings.filter((listing) => listing.price <= price));
  };

  const filterByCategory = (category: string) => {
    if (category === "") {
      setFilteredListings(listings);
    } else {
      setFilteredListings(
        listings.filter((listing) => listing.Category === category)
      );
    }
  };

  const filterByStatus = (status: string) => {
    if (status === "") {
      setFilteredListings(listings);
    } else {
      setFilteredListings(
        listings.filter((listing) => listing.status === status)
      );
    }
  };

  return (
    <div className="booking-layout">
      <Row>
        <Col md={3} className="filter-section">
          <h4>Filters</h4>

          <Form.Group controlId="priceRange">
            <Form.Label>Max Price: ${priceFilter}</Form.Label>
            <Form.Control
              type="range"
              min="0"
              max="300"
              value={priceFilter}
              onChange={handlePriceFilterChange}
            />
          </Form.Group>

          <Form.Group controlId="categorySelect">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={categoryFilter}
              //onChange={handleCategoryFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Standup comedy">Standup comedy</option>
              <option value="Concert">Concert</option>
              <option value="Party">Party</option>
              <option value="Sport events">Sport events</option>
              <option value="Bazaars">Bazaars</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="statusSelect">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={statusFilter}
              //onChange={handleStatusFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Inactive">Inactive</option>
            </Form.Control>
          </Form.Group>

          <Button
            variant="secondary"
            onClick={() => {
              setPriceFilter(0);
              setCategoryFilter("");
              setStatusFilter("");
              setFilteredListings(listings);
            }}
          >
            Reset Filters
          </Button>
        </Col>

        <Col md={9}>
          <Row>
            {filteredListings.map((listing) => (
              <Col md={12} key={listing.id}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>{listing.title}</Card.Title>
                    <Row>
                      <Col md={2}>
                        <strong>Price:</strong> ${listing.price}
                      </Col>
                      <Col md={3}>
                        <strong>Category:</strong> {listing.Category}
                      </Col>
                      <Col md={2}>
                        <strong>Status:</strong> {listing.status}
                      </Col>
                      <Col md={2}>
                        <strong>Date:</strong> {listing.Date}
                      </Col>
                      <Col md={2}>
                        <strong>Time:</strong> {listing.Time}
                      </Col>
                    </Row>
                    <Button variant="primary" className="mt-3">
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default BookingLayout;
