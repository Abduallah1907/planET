import React, { useEffect, useState } from "react";
import { Col, Row, Container, Form, InputGroup, Button } from "react-bootstrap";
import FilterBy from "../../components/FilterBy/FilterBy";
import CustomActivityCard from "../../components/Cards/ActivityCard";
import { FaSearch } from "react-icons/fa";
import { BiSort } from "react-icons/bi";
import { ActivityService } from "../../services/ActivityService";
import { IActivity } from "../../types/IActivity";
import { useNavigate } from "react-router-dom";
import { reverseGeoCode } from "../../utils/geoCoder";
import { useAppSelector } from "../../store/hooks";
import { set } from "date-fns";

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [filtercomponent, setfilterComponents] = useState({});
  const [sortBy, setSortBy] = useState("topPicks"); // State for sort by selection
  const [filter, setFilter] = useState({});
  const [addresses, setAddresses] = useState<{ [key: string]: string }>({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const getAddresses = async () => {
    const addressesData = await Promise.all(
      activities.map(async (activity) =>
        await reverseGeoCode(activity.location.latitude, activity.location.longitude)
      )
    );
    const addressesMap = Object.fromEntries(
      addressesData.map((address, index) => [
        activities[index]._id,
        (address as any)[2]?.formatted_address.split(",")[0] || "Unknown address",
      ])
    );
    setAddresses(addressesMap);
  }

  const getActivities = async () => {
    const activitiesData = await ActivityService.getAllActivities();
    setActivities(activitiesData.data);
  };

  const getFilteredActivites = async (currentFilter: any) => {
    console.log(currentFilter);
    const modifiedFilter = Object.fromEntries(
      Object.entries(currentFilter).map(([key, value]) =>
        Array.isArray(value) ? [key, value.join(",")] : [key, value]
      )
    );
    const activitiesData = await ActivityService.getFilteredActivites(
      modifiedFilter
    );
    setActivities(activitiesData.data);
  };

  const handleApplyFilters = () => {
    getFilteredActivites(filter);
  };

  const getFilterComponents = async () => {
    const filterData = await ActivityService.getFilterComponents();
    setfilterComponents(filterData.data);
  };

  const user = useAppSelector((state) => state.user);

  const [initialFilter, setInitialFilter] = useState({});

  useEffect(() => {
    getFilterComponents();
    if (user.role === "TOURIST") {
      if (user.stakeholder_id?.preferences?.length > 0) {
        console.log("Test", user.stakeholder_id?.preferences);
        const prefrences = user.stakeholder_id.preferences;
        const newFilter = {
          ...filter,
          tag: prefrences.map((prefrence:any) => prefrence.type),
        };
        setFilter(newFilter);
        setInitialFilter(newFilter);
        getFilteredActivites(newFilter);
      } else {
        getActivities();
      }
    } else {
      getActivities();
    }
  }, []);

  
  useEffect(() => {
    if (activities.length > 0) {
      getAddresses();
    }
  }, [activities]);

  // Function to sort activities based on selected criteria
  const sortedActivities = [...activities].sort((a, b) => {
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

  const onActivityClick = (id: string) => {
    navigate(`/Activity/${id}`);
  };

  const filteredActivities = sortedActivities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onFilterChange = (newFilter: { [key: string]: any }) => {
    setFilter(newFilter);
  };

  return (
    <Container>
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            Explore Activities
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
            initialFilter={initialFilter}
          />
        </Col>

        <Col md={9} className="p-3 pt-0">
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
            {filteredActivities.map((activity: IActivity, index) => (
              <Col key={index} xs={12} className="mb-4 ps-0">
                {/* Full-width stacking */}
                <CustomActivityCard
                  id={activity._id}
                  Name={activity.name}
                  location={addresses[activity._id]} // Location is an object
                  latLng={{ lat: activity.location.latitude, lng: activity.location.longitude }}
                  category={activity.category ? activity.category.type : ""} // Category is an object
                  tags={activity.tags.map((item: { type: any }) => item.type)}
                  image={""}
                  RatingVal={activity.average_rating}
                  Reviews={activity.reviews_count ?? 0}
                  Price={activity.price || 0}
                  Date_Time={new Date(activity.date)}
                  isActive={activity.active_flag}
                  isBooked={activity.booking_flag}
                  onClick={() => onActivityClick(activity._id)}
                  isAdvertiser={false}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
