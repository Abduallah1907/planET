import React, { useEffect } from "react";
import { Col, Row, Container, Form, InputGroup, Button } from "react-bootstrap";
import FilterBy from "../../components/FilterBy/FilterBy";
import CustomActivityCard from "../../components/Cards/ActivityCard";
import { FaSearch } from "react-icons/fa";
import { BiSort } from "react-icons/bi";
import { ActivityService } from "../../services/ActivityService";
import { IActivity } from "../../types/IActivity";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { reverseGeoCode } from "../../utils/geoCoder";

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activities, setActivities] = React.useState<IActivity[]>([]);
  const [filtercomponent, setfilterComponents] = React.useState({});
  const [sortBy, setSortBy] = React.useState("topPicks"); // State for sort by selection
  const [filter, setFilter] = React.useState({});
  const [addresses, setAddresses] = React.useState<{ [key: string]: string }>({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const Advertiser = useAppSelector((state) => state.user);

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
    const activitiesData = await ActivityService.getActivitiesByAdvertiserId(
      Advertiser.stakeholder_id._id
    );
    setActivities(activitiesData.data);
    // Download images for each activity
    /* const imagePromises = activitiesData.data.map(
      async (activity: IActivity) => {
        if (activity.) {
          const imageUrl = await ActivityService.downloadActivityImage(
            activity.imageId
          );
          return { id: activity._id, url: imageUrl };
        }
        return null;
      }
    );

    const imageData = (await Promise.all(imagePromises)).filter(Boolean);
    const imagesMap = imageData.reduce(
      (acc, image) => ({ ...acc, [image!.id]: image!.url }),
      {}
    );
    setImageUrls(imagesMap);*/
  };

  const getFilteredActivites = async () => {
    const modifiedFilter = Object.fromEntries(
      Object.entries(filter).map(([key, value]) =>
        Array.isArray(value) ? [key, value.join(",")] : [key, value]
      )
    );
    modifiedFilter["advertiser_id"] = Advertiser.stakeholder_id._id;
    const activitiesData = await ActivityService.getFilteredActivites(
      modifiedFilter
    );
    setActivities(activitiesData.data);
  };

  const handleApplyFilters = () => {
    getFilteredActivites();
  };

  const getFilterComponents = async () => {
    const filterData = await ActivityService.getFilterComponents();
    setfilterComponents(filterData.data);
  };
  useEffect(() => {
    getActivities();
    getFilterComponents();
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

  const deleteActivity = async (id: string) => {
    // Perform the delete action here
    setActivities(activities.filter((item) => item._id !== id));
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
              <Col key={index} xs={12} className="mb-4">
                {" "}
                {/* Full-width stacking */}
                <CustomActivityCard
                  id={activity._id}
                  Name={activity.name}
                  location={addresses[activity._id]}
                  latLng={{ lat: activity.location.latitude, lng: activity.location.longitude }}
                  category={activity.category ? activity.category.type : ""}
                  tags={activity.tags.map((item: { type: any }) => item.type)}
                  image={""}
                  RatingVal={activity.average_rating}
                  Reviews={activity.reviews_count ?? 0}
                  Price={activity.price || 0}
                  Date_Time={new Date(activity.date)}
                  isActive={activity.active_flag}
                  isBooked={activity.booking_flag}
                  onClick={() => onActivityClick(activity._id)}
                  onDelete={() => deleteActivity(activity._id)}
                  isAdvertiser={true}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
