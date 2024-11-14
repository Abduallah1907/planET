import React, { useEffect, useState } from 'react';
import { Container, Badge, Modal, Button } from 'react-bootstrap';
import { FaBookmark, FaRegBookmark, FaShareAlt } from 'react-icons/fa';
import Rating from '../../components/Rating/Rating';
import './historicalcard.css'
import { HistoricalService } from '../../services/HistoricalService';
import { useAppSelector } from '../../store/hooks';


interface ILocalHistoricalLocationTourist {
  _id: string;
  name: string;
  location: string;
  image?: string;
  average_rating: number;
  reviews: number;
  description: string;
  active_flag: boolean;
  tags: string[];
  price: number;
  opening_hours_from: string;
  opening_hours_to: string;
  opening_days: string[];
}

const HistoricalCard: React.FC<{ id: string }> = ({ id }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAdvertiserModal, setShowAdvertiserModal] = useState(false);
  const [localHistoricalData, setLocalHistoricalData] =
    useState<ILocalHistoricalLocationTourist | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleAdvertiserClick = () => {
    setShowAdvertiserModal(true);
  };

  const handleCloseAdvertiserModal = () => {
    setShowAdvertiserModal(false);
  };
 
  const user = useAppSelector((state) => state.user);

  const getHistoricalLocationById = async (id: string) => {
    const historicalLocation =
      await HistoricalService.getHistoricalLocationById(id);
    setLocalHistoricalData(historicalLocation.data);
  };
  useEffect(() => {
    getHistoricalLocationById(id);
  }, [id]);

  const shareLink = `${window.location.origin}/Historical/${id}`;


  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Check out this historical location!');
    const body = encodeURIComponent(`I found this interesting historical location: ${shareLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this historical location!',
          text: 'I found this interesting historical location:',
          url: shareLink,
        });
      } catch (err) {
        console.error('Error sharing: ', err);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      copyToClipboard();
    }
  };


  
  return (
    <Container className="historical-card-container mt-5">
      <div className="historical-card">
        <div className="historical-details">
          <div className="image-placeholder">
            <div className="mt-3 d-flex justify-content-between">
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
              <h2 className="me-3">
                {localHistoricalData ? localHistoricalData.name : ""}
              </h2>
              {localHistoricalData &&
                Array.isArray(localHistoricalData.tags) &&
                localHistoricalData.tags.map((tag: any, index: any) => (
                  <Badge
                    key={index}
                    pill
                    bg="tag"
                    className="me-2 custom-badge"
                  >
                    {tag}
                  </Badge>
                ))}
              <div className="d-flex align-items-center ms-auto rating-stars">
                {/* Rating Stars */}
                <div>
                  <Rating
                    rating={
                      localHistoricalData
                        ? localHistoricalData.average_rating
                        : 0
                    }
                    readOnly={true}
                  />
                </div>
                <Badge
                  className="ms-2 review-badge text-center"
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  {localHistoricalData
                    ? localHistoricalData.average_rating
                    : "0.0"}
                </Badge>
              </div>
            </div>
            {/* <p className='Advertiser' onClick={handleAdvertiserClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
              {localHistoricalData?.advertiser_id.user_id.name}
            </p> */}
            <p className="Description"> {localHistoricalData?.description}</p>
            <p className="opening-hours">
              {" "}
              {localHistoricalData?.opening_hours_from} -{" "}
              {localHistoricalData?.opening_hours_to}
            </p>
            <p className="opening-days">
              Opening Days: {localHistoricalData?.opening_days.join(", ")} 
            </p>
            <p className="price"> Price: {localHistoricalData?.price}</p>

            {user.role==="TOURIST"  && (
            <div className="d-flex justify-content-center">
           
              <Button className="share-button-historical" onClick={handleShare}>
                <FaShareAlt />
              </Button>
            </div>
            )}
          </div>
        </div>
      </div>

  

      <Modal
        show={showAdvertiserModal}
        onHide={handleCloseAdvertiserModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Advertiser Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>ID:</strong> {localHistoricalData?._id}
          </p>
          <p>
            <strong>Name:</strong> {localHistoricalData?.name}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {localHistoricalData?.location.toString()}
          </p>
          {/* Add more advertiser details here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="main-inverse" onClick={handleCloseAdvertiserModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HistoricalCard;
