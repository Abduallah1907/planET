import React, { useEffect, useState } from 'react';
import { Container, Badge, Modal, Button } from 'react-bootstrap';
import { FaRegHeart, FaHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Rating from '../../components/Rating/Rating';
import './historicalcard.css'
import { HistoricalService } from '../../services/HistoricalService';

interface IHistoricalLocation {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  average_rating: number;
  reviews: number;
  description: string;
  active_flag: boolean;
  tags: string[];
  native_price: number;
  opening_hours_from: string;
  opening_hours_to: string;
  opening_days: string[];
}

const HistoricalCard: React.FC<{ id: string }> = ({ id }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAdvertiserModal, setShowAdvertiserModal] = useState(false);
  const [localHistoricalData, setLocalHistoricalData] = useState<IHistoricalLocation | null>(null);
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
  const handleReserve = () => {
    setShowModal(true);
  };

  const confirmReserve = () => {
    setShowModal(false);
    if (localHistoricalData && localHistoricalData.active_flag) {
      alert('Activity reserved successfully!');
    } else {
      alert('Activity is not available for reservation!');
    }
  };

  const getHistoricalLocationById = async (id: string) => {
    const historicalLocation = await HistoricalService.getHistoricalLocationById(id);
    setLocalHistoricalData(historicalLocation.historical_location.data);
  };
  useEffect(() => {
    getHistoricalLocationById(id);
      }, [id]);

  return (
    <Container className='historical-card-container mt-5'>
      <div className="historical-card">
        <div className="historical-details">
          <div className="image-placeholder">
            <div className='mt-3 d-flex justify-content-between'>
              <i onClick={toggleBookmark} style={{ cursor: 'pointer' }}>
                {isBookmarked ? <FaBookmark color="white" /> : <FaRegBookmark color='white' />}
              </i>
            </div>
          </div>
          <div className="details">
            <div className="d-flex align-items-center">
              <h2 className="me-3">{localHistoricalData ? localHistoricalData.name : ''}</h2>
              {localHistoricalData && (localHistoricalData.tags ?? []).map((tag:any, index:any) => (
                <Badge key={index} pill bg="tag" className="me-2 custom-badge">
                  {tag}
                </Badge>
              ))}
                <div className="d-flex align-items-center ms-5 rating-stars">
                {/* Rating Stars */}
                <div style={{ marginLeft: '12rem' }}>
                  <Rating
                    rating={localHistoricalData ? localHistoricalData.average_rating : 0}
                    readOnly={true}
                  />
                </div>
                <Badge
                  className="ms-2 review-badge text-center"
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  {localHistoricalData ? localHistoricalData.average_rating : '0.0'}
                </Badge>
              </div>
            </div>
            <p className='Advertiser' onClick={handleAdvertiserClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
              {localHistoricalData?.location.toString()}
            </p>
            <p className='Category'>{localHistoricalData?.description}</p>
            <p className="date">{localHistoricalData?.opening_hours_from ? new Date(localHistoricalData.opening_hours_from).toLocaleDateString() : 'Date not available'}</p>
            <p className="time">{localHistoricalData?.opening_hours_to}</p>
            <p className="price">${localHistoricalData?.native_price}</p>

            <div className="d-flex justify-content-center">
              <button className="reserve-button" onClick={() => handleReserve}>Reserve</button>
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
          <p><strong>Activity Name:</strong> {localHistoricalData?.name}</p>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmReserve}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showAdvertiserModal} onHide={handleCloseAdvertiserModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Advertiser Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>ID:</strong> {localHistoricalData?.id}</p>
            <p><strong>Name:</strong> {localHistoricalData?.name}</p>
            <p><strong>Location:</strong> {localHistoricalData?.location.toString()}</p>
          {/* Add more advertiser details here */}
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

export default HistoricalCard;