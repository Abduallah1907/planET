import React, { useEffect, useMemo, useState } from "react";
import "./ActivityCard.css";
import { Container, Badge, Modal, Button } from "react-bootstrap";
import { FaShareAlt, FaBookmark, FaRegBookmark } from "react-icons/fa";
import Rating from "../../components/Rating/Rating";
import { ActivityService } from "../../services/ActivityService";
import { IActivity } from "../../types/IActivity";
import { use } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { Utils } from "../../utils/utils";
import { useAppContext } from "../../AppContext";
import { TouristService } from "../../services/TouristService";

interface ActivityCardProps {
  id: string;
}
interface Advertiser {
  image: string;
  name: string;
  email: string;
  phone: string;
  location: { longitude: number; latitude: number };
}
interface ActivityData {
  name: string;
  tags: string[];
  average_rating: number;
  advertiser: Advertiser;
  category: string;
  date: Date;
  time: string;
  price: number; 
  booking_flag: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ id }) => {
  const tourist = useAppSelector((state) => state.user);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activityData, setActivityData] = useState<IActivity | null>(null);
  const [showAdvertiserModal, setShowAdvertiserModal] = useState(false);
  const { id: activity_id } = useParams<{ id: string }>(); // Destructure `id` from URL params
  const shareLink = activityData
    ? `${window.location.origin}/activity/${activityData._id}`
    : "";
  const navigate = useNavigate();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();

  const convertedPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(activityData?.price ?? 0, baseCurrency, currency);
  }, [activityData, baseCurrency, currency, getConvertedCurrencyWithSymbol]);


  const shareViaEmail = () => {
    const subject = encodeURIComponent("Check out this activity!");
    const body = encodeURIComponent(
      `I found this interesting activity: ${shareLink}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this activity!",
          text: "I found this interesting activity:",
          url: shareLink,
        });
      } catch (err) {
        console.error("Error sharing: ", err);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      copyToClipboard();
    }
  };

  const toggleBookmark = async () => {
    if (!activityData?._id) {
      console.error("Activity ID is undefined.");
      alert("Activity data is not loaded. Unable to toggle bookmark.");
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
        ? await TouristService.bookmarkActivity(tourist.email, activityData._id)
        : await TouristService.unbookmarkActivity(tourist.email, activityData._id);
  
      if (response?.success) {
        setIsBookmarked(updatedStatus);
        const action = updatedStatus ? "bookmarked" : "removed from bookmarks";
      } else {
        throw new Error(response?.message || "Unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      const action = !isBookmarked ? "bookmark" : "unbookmark";
    }
  };
  
  

  const handleReserve = () => {
    setShowModal(true);
  };

  const confirmReserve = () => {
    setShowModal(false);
    if (activityData && activityData.booking_flag) {
      handleBookNow();
    } else {
      alert("Activity is not available for reservation!");
    }
  };
  const user = useAppSelector((state) => state.user);
  const getActivityById = async (id: string) => {
    // Fetch activity data by id
    const activity = await ActivityService.getActivityById(id);
    setActivityData(activity.data);
  };
  useEffect(() => {
    getActivityById(id);
  }, [id]);

  const handleAdvertiserClick = () => {
    setShowAdvertiserModal(true);
  };

  const handleCloseAdvertiserModal = () => {
    setShowAdvertiserModal(false);
  };
  const handleBookNow = () => {
    navigate(`/bookActivity/${activityData?._id}`);
  };
  return (
    <Container className="activity-card-container mt-5">
      <div className="activity-card">
        <div className="activity-details">
          <div className="image-placeholder">
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
          <div className="details">
            <div className="d-flex align-items-center">
              <h2 className="me-3">{activityData ? activityData.name : ""}</h2>
              {activityData &&
                (activityData.tags ?? []).map((tag: any, index: number) => (
                  <Badge
                    key={index}
                    pill
                    bg="tag"
                    className="me-2 custom-badge"
                  >
                    {tag.type}
                  </Badge>
                ))}

              <div className="d-flex align-items-center ms-auto rating-stars">
                {/* Rating Stars */}
                <div>
                  <Rating
                    rating={activityData ? activityData.average_rating : 0}
                    readOnly={true}
                  />
                </div>
                <Badge
                  className="ms-2 review-badge text-center"
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  {activityData ? activityData.average_rating : "0.0"}
                </Badge>
              </div>
            </div>

            <p
              className="Advertiser"
              onClick={handleAdvertiserClick}
              style={{
                cursor: "pointer",
                color: "#d76f30",
                textDecoration: "underline",
              }}
            >
              {activityData?.advertiser_id.user_id.name}
            </p>
            <p className="Category">
              {activityData?.category ? activityData?.category.type : ""}
            </p>
            <p className="date">
              {activityData?.date
                ? Utils.formatDateDay(new Date(activityData.date))
                : "Date not available"}
            </p>
            <p className="time">{activityData?.time}</p>
            <p className="price">{convertedPrice}</p>

            <div className="d-flex justify-content-center">
              {user.role === "TOURIST" && (
                <div className="d-flex justify-content-center">
                  <button className="reserve-button" onClick={handleReserve}>
                    Reserve
                  </button>
                  <Button className="share-button" onClick={handleShare}>
                    <FaShareAlt />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to reserve this activity?</p>
          <p>
            <strong>Activity Name:</strong> {activityData?.name}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {activityData?.date
              ? new Date(activityData.date).toLocaleDateString()
              : "Date not available"}
          </p>
          <p>
            <strong>Time:</strong> {activityData?.time}
          </p>
          <p>
            <strong>Price:</strong> {convertedPrice}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="main"
            className="border-warning-subtle"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button variant="main-inverse" onClick={confirmReserve}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAdvertiserModal}
        onHide={handleCloseAdvertiserModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Advertiser Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={activityData?.advertiser_id.logo} alt="Advertiser" />
          <p>
            <strong>Name:</strong> {activityData?.advertiser_id.user_id.name}
          </p>
          <p>
            <strong>Email:</strong> {activityData?.advertiser_id.user_id.email}
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            {activityData?.advertiser_id.user_id.phone_number}
          </p>
          <p>
            <strong>Location:</strong> {activityData?.location.latitude},{" "}
            {activityData?.location.longitude}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdvertiserModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default ActivityCard;
