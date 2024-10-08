import React, { useEffect, useState } from "react";
import { Col, Row, Container, Form, InputGroup, Button } from "react-bootstrap";
import ItineraryCard from "../../components/Cards/ItineraryCard";
import FilterBy from "../../components/FilterBy/FilterBy";
import { FaSearch } from "react-icons/fa";
import { BiSort } from "react-icons/bi";
import { ItineraryService } from "../../services/ItineraryService";
import { IItinerary } from "../../types/IItinerary";
import { useNavigate } from "react-router-dom";

export default function ItinerariesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [itineraries, setItineraries] = useState<IItinerary[]>([]);
  const [filtercomponent, setfilterComponents] = useState({});
  const [sortBy, setSortBy] = useState("topPicks"); // State for sort by selection
  const [filter,setFilter] = React.useState({});

  const getFilterComponents = async () => {
    const filterData = await ItineraryService.getFilterComponents();
    setfilterComponents(filterData.data);
  };
  const getItinerary = async () => {
    const ItinerariesData = await ItineraryService.getAllItineraries(1);
    setItineraries(ItinerariesData.data);
  };
  const getFilteredItineraries = async () => {
    const modifiedFilter = Object.fromEntries(
      Object.entries(filter).map(([key, value]) =>
        Array.isArray(value) ? [key, value.join(",")] : [key, value]
      )
    );
    const ItinerariesData = await ItineraryService.getFilteredItineraries(modifiedFilter);
    setItineraries(ItinerariesData.data);
  }

  const handleApplyFilters = () => {
    getFilteredItineraries();
  }
  useEffect(() => {
    
     getItinerary();
    getFilterComponents();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  const onFilterChange = (newFilter: {[key: string]: any;}) => {
    setFilter(newFilter);
  }

  // Function to sort activities based on selected criteria
  const sortedItineraries = [...itineraries].sort((a, b) => {
    switch (sortBy) {
      case "topPicks":
        return b.average_rating - a.average_rating;
      case "priceHighToLow":
        return a.price - b.price;
      case "priceLowToHigh":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const filteredItineraries= sortedItineraries.filter((itinerary) =>
    itinerary.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const onItineraryClick = (id : string) => {
    navigate(`/itinerary/${id}`);
  }

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>Explore Itineraries</h1>
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
              </Form.Select>
            </div>

            {/* Display Itinerary Cards */}
            {filteredItineraries.map((itinerary, index) => (
              <Col key={index} xs={12} className="mb-4 ps-0"> {/* Full-width stacking */}
                <ItineraryCard
                  name={itinerary.name}
                  comments={""}
                  timeline={""}
                  locations={""}
                  pickup_loc={""}
                  drop_off_loc={""}
                  Languages={itinerary.languages.join(",")}
                  accessibility={itinerary.accessibility}
                  RatingVal={itinerary.average_rating}
                  Reviews={itinerary.Reviews}
                  Price={itinerary.price}
                  Duration={itinerary.duration}
                  Available_Dates={itinerary.available_dates}
                  isActive={itinerary.active_flag}
                  tags={itinerary.tags}
                  onChange={() => console.log(`${itinerary.locations} booking status changed`)}                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

