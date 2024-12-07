import {
  Card,
  Badge,
  Row,
  Col,
  Image,
  DropdownButton,
  Dropdown,
  Modal,
  Button,
} from "react-bootstrap";
import "./Cards.css";
import Rating from "../Rating/Rating";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, MouseEvent as ReactMouseEvent } from "react";
import { useAppContext } from "../../AppContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ActivityService } from "../../services/ActivityService";
import { Utils } from "../../utils/utils";
import MapModal from "../MapModal";
import { TouristService } from "../../services/TouristService";
import { setStakeholder } from "../../store/userSlice";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

interface InputData {
  Name: string;
  location: string;
  latLng: { lat: number; lng: number };
  category: string;
  tags?: string[];
  id: string;
  RatingVal: number; // Initial Rating
  Reviews: number;
  Price: number;
  Date_Time: Date;
  isActive: boolean;
  isBooked: boolean; // Added isBooked prop
  image?: string;
  onChange?: () => void; // Change onChange to a function that does not take parameters
  onClick?: () => void;
  onDelete?: () => void;
  isAdvertiser: boolean;
  onFlag?: () => void; // Add onFlag function
}

const CustomActivityCard = ({
  id,
  Name,
  location,
  latLng,
  category,
  tags,
  RatingVal,
  Reviews,
  Price,
  Date_Time,
  isActive,
  isBooked,
  onChange,
  onClick,
  onDelete,
  isAdvertiser,
  onFlag,
}: InputData) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false); // State for flag confirmation modal
  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } =
    useAppContext();

  const convertedPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(Price, baseCurrency, currency);
  }, [Price, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

  const tourist = useAppSelector((state) => state.user);
  const [isBookmarked, setIsBookmarked] = useState(tourist?.stakeholder_id?.bookmarks?.includes(id) ?? false);

  const user = useAppSelector((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  // Manage the state for the rating
  const navigate = useNavigate();
  const handleEdit = (activity_id: string) => {
    navigate(`/EditActivity/${activity_id}`); // Navigate to the EditProduct page
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleFlag = () => {
    setShowFlagModal(true); // Show flag confirmation modal
  };

  const confirmFlag = async () => {
    await ActivityService.flagInappropriate(id); // Call the flagInappropriate function from the service
    setShowFlagModal(false); // Close modal after confirming
    onFlag && onFlag(); // Call the onFlag function passed as a prop
  };

  const cancelFlag = () => {
    setShowFlagModal(false); // Close modal without action
  };

  const confirmDelete = async () => {
    // Perform the delete action here
    const deletedActivity = await ActivityService.deleteActivity(id); // Call the deleteActivity function from the service
    setShowDeleteModal(false); // Close modal after confirming
    if (deletedActivity) {
      onDelete && onDelete(); // Call the onDelete function passed as a prop
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Close modal without action
  };

  const date = Date_Time.toLocaleDateString();
  const time = Date_Time.toLocaleTimeString();

  const openMapModal = (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.stopPropagation();
    setShowMapModal(true);
  }

  const closeMapModal = () => {
    setShowMapModal(false);
  }

  const dispatch = useAppDispatch();

  const toggleBookmark = async (e: ReactMouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!id) {
      console.error("Activity ID is undefined.");
      alert("Activity data is not loaded. Unable to toggle bookmark.");
      return;
    }

    if (tourist.role !== "TOURIST") {
      console.error("User is not a tourist.");
      alert("You must be a tourist to bookmark activities.");
      return;
    }
  
    if (!tourist?.email) {
      console.error("Tourist email is undefined.");
      alert("Tourist email is not available. Unable to toggle bookmark.");
      return;
    }
  
    try {
      const updatedStatus = !isBookmarked;
      const response = updatedStatus
        ? await TouristService.bookmarkActivity(tourist.email, id)
        : await TouristService.unbookmarkActivity(tourist.email, id);
  
      if (response?.success) {
        setIsBookmarked(updatedStatus);
        const newStakeholder = {
            ...tourist.stakeholder_id,
            bookmarks: updatedStatus
              ? [...tourist.stakeholder_id.bookmarks, id]
              : tourist.stakeholder_id.bookmarks.filter((bookmark: string) => bookmark !== id),
        }
        dispatch(setStakeholder(newStakeholder));
        const action = updatedStatus ? "bookmarked" : "removed from bookmarks";
      } else {
        throw new Error(response?.message || "Unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      const action = !isBookmarked ? "bookmark" : "unbookmark";
    }
  };

  return (
    <Card
      className="p-3 shadow-sm"
      style={{ borderRadius: "10px", height: "100%" }}
    >
      <Row className="h-100 d-flex align-items-stretch justify-content-between ps-2">
        {/* Image Section */}
        <Col
          md={2}
          className="p-0 d-flex align-items-stretch"
          onClick={onClick}
        >
          <Image
            src="https://via.placeholder.com/250x250"
            rounded
            alt="Activity Image"
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
          />
          <div className="activity-bookmark">
            <div className="mt-3">
              <i onClick={toggleBookmark} style={{ cursor: "pointer" }}>
                {isBookmarked ? (
                  <FaBookmark color="white" />
                ) : (
                  <FaRegBookmark color="white" />
                )}
              </i>
            </div>
          </div>
        </Col>

        {/* Main Info Section */}
        <Col
          md={isAdvertiser || isAdmin ? 6 : 7}
          className="d-flex align-items-stretch"
          onClick={onClick}
        >
          <Card.Body className="p-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-1">
                {/* Activity Name */}
                <Card.Title
                  className="mb-0"
                  style={{ fontWeight: "bold", marginRight: "10px" }}
                >
                  {Name}
                </Card.Title>
                {/* Badges next to Activity Name */}

                {(tags || []).map((tag, index) => (
                  <Badge
                    key={index}
                    pill
                    bg="tag"
                    className="me-2 custom-badge"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <Card.Text>
                <a
                  href="#"
                  className="text-danger"
                  style={{ fontSize: "0.9rem" }}
                  onClick={openMapModal}
                >
                  {location} • Show on map
                </a>
              </Card.Text>

              {/* Category and Date/Time */}
              <Card.Text className="text-muted">Category: {category}</Card.Text>
              <Card.Text className="text-muted">
                {Utils.formatDateDay(new Date(date))} <br />
                {time}
              </Card.Text>
            </div>
          </Card.Body>
        </Col>

        {/* Rating, Reviews, Price Section */}
        <Col
          md={3}
          className="d-flex flex-column justify-content-between align-items-end"
          onClick={onClick}
        >
          {/* Rating and Reviews on the Far Right */}
          <div className="d-flex align-items-center justify-content-end mb-1">
            {/* Rating Stars */}
            <Rating rating={RatingVal} readOnly={true} />
            <Badge
              className="ms-2 review-badge text-center"
              style={{
                fontSize: "1rem",
              }}
            >
              {RatingVal.toFixed(1)}
            </Badge>
          </div>
          <p
            className="text-muted text-right"
            style={{ fontSize: "1.1rem", fontWeight: "500" }}
          >
            {Reviews.toLocaleString()} Reviews
          </p>

          {/* Price and Active/Inactive Button */}
          <div className="text-end">
            <h4 style={{ fontWeight: "bold" }}>{convertedPrice}</h4>
            {isAdvertiser ? (
              <Badge
                bg={isActive && isBooked ? "active" : "inactive"} // Change color based on booking status
                className="mt-2 custom-status-badge rounded-4 text-center"
                onClick={onChange} // Call onChange when clicked
              >
                {!isActive
                  ? "Inactive"
                  : isBooked
                  ? "Booking On"
                  : "Booking Off"}
              </Badge>
            ) : null}
          </div>
        </Col>
        {isAdvertiser || isAdmin ? (
          <Col md={1} className="d-flex align-items-baseline">
            <DropdownButton
              align="end"
              title="⋮" // Three-dot symbol
              variant="light"
              className="d-flex justify-content-end ms-3 btn-main-inverse"
            >
              {isAdvertiser ? (
                <>
                  <Dropdown.Item onClick={() => id && handleEdit(id)}>
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
                </>
              ) : (
                <Dropdown.Item onClick={() => id && handleFlag()}>
                  Flag Inappropriate
                </Dropdown.Item>
              )}
            </DropdownButton>
          </Col>
        ) : null}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this activity?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="main"
            className="border-warning-subtle"
            onClick={cancelDelete}
          >
            Cancel
          </Button>
          <Button variant="main-inverse" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Flag Confirmation Modal */}
      <Modal show={showFlagModal} onHide={cancelFlag} centered>
        <Modal.Header closeButton>
          <Modal.Title>Flag Inappropriate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to flag this Activity as inappropriate?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="main"
            className="border-warning-subtle"
            onClick={cancelFlag}
          >
            Cancel
          </Button>
          <Button variant="main-inverse" onClick={confirmFlag}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <MapModal
        open={showMapModal}
        handleClose={closeMapModal}
        center={latLng}
        onMapClick={() => {}}
        viewingMode={true}
      />
    </Card>
  );
};

export default CustomActivityCard;
