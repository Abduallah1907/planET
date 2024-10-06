import React from "react";
import { Col, Row, Container, Form, InputGroup } from "react-bootstrap";
import ItineraryCard from "../components/Cards/ItineraryCard";
import FilterBy from "../components/FilterBy/FilterBy";
import { FaSearch } from "react-icons/fa";
import { BiSort } from "react-icons/bi";
import filterOptions from '../utils/filterOptions.json';

const activityData = [
  {
    locations: "Hiking Adventure",
    pickup: "Mountain Base",
    dropoff: "Mountain Peak",
    Languages: "English, Spanish",
    accessibility: true,
    RatingVal: 4.5,
    Reviews: 120,
    Price: 150.0,
    Duration: "3 hours",
    Available_Dates: new Date(),
    isActive: true,
    isBooked: true,
    tags: ["Adventure", "Nature"],
  },
  {
    locations: "City Night Tour",
    pickup: "Downtown",
    dropoff: "Central Park",
    Languages: "English, French",
    accessibility: false,
    RatingVal: 4.8,
    Reviews: 95,
    Price: 100.0,
    Duration: "2 hours",
    Available_Dates: new Date(),
    isActive: true,
    isBooked: false,
    tags: ["NightLife", "City"],
  },
  {
    locations: "Football Match",
    pickup: "Stadium Entrance",
    dropoff: "Stadium Exit",
    Languages: "English, Arabic",
    accessibility: true,
    RatingVal: 4.0,
    Reviews: 50,
    Price: 70.0,
    Duration: "4 hours",
    Available_Dates: new Date(),
    isActive: true,
    isBooked: false,
    tags: ["Sports", "Entertainment"],
  },
];

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("topPicks"); // State for sort by selection

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  // Function to sort activities based on selected criteria
  const sortedActivities = [...activityData].sort((a, b) => {
    switch (sortBy) {
      case "topPicks":
        return b.RatingVal - a.RatingVal;
      case "priceLowToHigh":
        return a.Price - b.Price;
      case "priceHighToLow":
        return b.Price - a.Price;
      default:
        return 0;
    }
  });

  const filteredActivities = sortedActivities.filter((activity) =>
    activity.locations.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>Explore Activities</h1>
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
          <FilterBy filterOptions={filterOptions}/>
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
              </Form.Select>
            </div>

            {filteredActivities.map((activity, index) => (
              <Col key={index} xs={12} className="mb-4 ps-0"> {/* Full-width stacking */}
                <ItineraryCard
                  locations={activity.locations}
                  pickup={activity.pickup}
                  dropoff={activity.dropoff}
                  Languages={activity.Languages}
                  accessibility={activity.accessibility}
                  RatingVal={activity.RatingVal}
                  Reviews={activity.Reviews}
                  Price={activity.Price}
                  Duration={activity.Duration}
                  Available_Dates={activity.Available_Dates}
                  isActive={activity.isActive}
                  isBooked={activity.isBooked}
                  tags={activity.tags}
                  onChange={() => console.log(`${activity.locations} booking status changed`)}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
