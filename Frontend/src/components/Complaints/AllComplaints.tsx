import React, { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import FilterBy from "../FilterBy/FilterBy";
import { useNavigate } from "react-router-dom";

export default function AllComplaints() {
  //   const navigate = useNavigate();
  //   const [itineraries, setItineraries] = useState<IItinerary[]>([]);
  //   const [filtercomponent, setfilterComponents] = useState({});
  //   const [sortBy, setSortBy] = useState("topPicks"); // State for sort by selection
  //   const [filter, setFilter] = React.useState({});

  //   const getFilteredItineraries = async () => {
  //     const modifiedFilter = Object.fromEntries(
  //       Object.entries(filter).map(([key, value]) =>
  //         Array.isArray(value) ? [key, value.join(",")] : [key, value]
  //       )
  //     );
  //     const ItinerariesData = await ItineraryService.getFilteredItineraries(
  //       modifiedFilter
  //     );
  //     setItineraries(ItinerariesData.data);
  //   };

  //   const handleApplyFilters = () => {
  //     getFilteredItineraries();
  //   };

  //   useEffect(() => {
  //     getItinerary();
  //     getFilterComponents();
  //   }, []);

  //   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     setSortBy(e.target.value);
  //   };
  //   const onFilterChange = (newFilter: { [key: string]: any }) => {
  //     setFilter(newFilter);
  //   };

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            All Complaints
          </h1>
        </Col>
      </Row>
      {/* <Row>
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
      </Row> */}
    </Container>
  );
}
