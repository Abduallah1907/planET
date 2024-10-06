import React from "react";
import { Col, Row, Container, Form, InputGroup } from "react-bootstrap";
import FilterBy from "../../components/FilterBy/FilterBy";
import CustomActivityCard from "../../components/Cards/ActivityCard";
import { FaSearch } from "react-icons/fa"; 
import { BiSort } from "react-icons/bi";

const activityData = [
  {
    Name: "Hiking Adventure",
    location: "Mountain View",
    category: "Adventure",
    imageUrl: "https://via.placeholder.com/250x250",
    RatingVal: 4.5,
    Reviews: 120,
    Price: 150.0,
    Date_Time: new Date(),
    isActive: true,
    isBooked: true,
  },
  {
    Name: "City Night Tour",
    location: "Downtown",
    category: "Nightlife",
    imageUrl: "https://via.placeholder.com/250x250",
    RatingVal: 4.8,
    Reviews: 95,
    Price: 100.0,
    Date_Time: new Date(),
    isActive: true,
    isBooked: false,
  },
  {
    Name: "Football Match",
    location: "Cairo International Stadium",
    category: "Sports",
    imageUrl: "https://via.placeholder.com/250x250",
    RatingVal: 4.0,
    Reviews: 50,
    Price: 70.0,
    Date_Time: new Date(),
    isActive: true,
    isBooked: false,
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
    activity.Name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <FilterBy />
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
               <Col key={index} xs={12} className="mb-4"> {/* Full-width stacking */}
               <CustomActivityCard
                 Name={activity.Name}
                 location={activity.location}
                 category={activity.category}
                 imageUrl={activity.imageUrl}
                 RatingVal={activity.RatingVal}
                 Reviews={activity.Reviews}
                 Price={activity.Price}
                 Date_Time={activity.Date_Time}
                 isActive={activity.isActive}
                 isBooked={activity.isBooked}
                 onChange={() => console.log(`${activity.Name} booking status changed`)}
               />
             </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
