import HistoricalLocationCard from "../components/Cards/HistoricalLocationCard";
import FilterBy from "../components/FilterBy/FilterBy";
import React from "react";
import { Col, Row, Container, Form, InputGroup } from "react-bootstrap";

import { FaSearch } from "react-icons/fa";

const historicalData = [
  {
    Name: "The Great Wall of China",
    location: "China",
    category: "Historical Landmark",
    imageUrl: "https://via.placeholder.com/250x250",
    RatingVal: 4.8,
    Reviews: 1500,
    Description: "A historic wall that stretches across northern China.",
    isActive: true,
    isBooked: false,
  },
  {
    Name: "The Pyramids of Giza",
    location: "Egypt",
    category: "Historical Wonder",
    imageUrl: "https://via.placeholder.com/250x250",
    RatingVal: 4.9,
    Reviews: 1200,
    Description: "One of the Seven Wonders of the Ancient World.",
    isActive: true,
    isBooked: false,
  },
  {
    Name: "Machu Picchu",
    location: "Peru",
    category: "Historical Site",
    imageUrl: "https://via.placeholder.com/250x250",
    RatingVal: 4.7,
    Reviews: 800,
    Description: "An Incan citadel set high in the Andes Mountains.",
    isActive: true,
    isBooked: true,
  },
];

export default function HistoricalLocationsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("topPicks"); // State for sort by selection

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  // Function to sort historical locations based on selected criteria
  const sortedLocations = [...historicalData].sort((a, b) => {
    switch (sortBy) {
      case "topPicks":
        return b.RatingVal - a.RatingVal;
      case "reviewsLowToHigh":
        return a.Reviews - b.Reviews;
      case "reviewsHighToLow":
        return b.Reviews - a.Reviews;
      default:
        return 0;
    }
  });

  const filteredLocations = sortedLocations.filter((location) =>
    location.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>Explore Historical Locations</h1>
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
        <Col md={3} className="border-bottom pb-2" style={{ height: "100vh", overflowY: "auto" }}>
          {/* Sort By Section */}
          <div
            style={{
              border: "1px solid #D76F30",
              borderRadius: "50px",
              padding: "5px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#F7F7F7",
              color: "#6c757d",
            }}
          >
            <span style={{ fontSize: "0.9rem", marginRight: "10px" }}>Sort By:</span>
            <Form.Select value={sortBy} onChange={handleSortChange} style={{ border: "none", backgroundColor: "transparent", color: "#D76F30", fontSize: "0.9rem" }}>
              <option value="topPicks">Our Top Picks</option>
              <option value="reviewsLowToHigh">Reviews: Low to High</option>
              <option value="reviewsHighToLow">Reviews: High to Low</option>
            </Form.Select>
          </div>

          {/* Filter By Component */}
          <FilterBy />
        </Col>

        <Col md={9} className="p-4">
          <Row>
            {filteredLocations.map((location, index) => (
              <Col key={index} xs={12} className="mb-4">
                <HistoricalLocationCard
                        Name={location.Name}
                        location={location.location}
                        category={location.category}
                        imageUrl={location.imageUrl}
                        RatingVal={location.RatingVal}
                        Reviews={location.Reviews}
                        Description={location.Description}
                        isActive={location.isActive}
                        isBooked={location.isBooked}
                        onChange={() => console.log(`${location.Name} booking status changed`)} NativePrice={0} ForeignPrice={0} StudentPrice={0} OpeningHourFrom={""} OpeningHourTo={""} OpeningDays={""}                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
