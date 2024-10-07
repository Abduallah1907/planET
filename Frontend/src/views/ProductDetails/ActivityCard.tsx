import React, { useEffect, useState } from 'react';
import './ActivityCard.css';
import { Container } from 'react-bootstrap';
import { FaRegHeart } from 'react-icons/fa';

const ActivityCard: React.FC = () => {
import { Container, Badge, Modal, Button } from 'react-bootstrap';
import { FaRegHeart, FaHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Rating from '../../components/Rating/Rating';
import { ActivityService } from '../../services/ActivityService';
import { IActivity } from '../../types/IActivity';
import { use } from 'i18next';



interface ActivityCardProps {
  id: string;
}
interface Advertiser {
  photo: string;
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
const Data : ActivityData = {
  name: "Activity Name",
  tags: ["Tag1", "Tag2", "Tag3"],
  average_rating: 4.5,
  advertiser: {
    photo: "",
    name: "Advertiser Name",
    email: "",
    phone: "",
    location: { longitude: 0, latitude: 0 },
  },
  category: "Category",
  date: new Date(),
  time: "Time",
  price: 100,
  booking_flag: true,
};

const ActivityCard: React.FC<ActivityCardProps> = ({ id }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activityData, setActivityData] = useState<IActivity | null>(null);
  const [showAdvertiserModal, setShowAdvertiserModal] = useState(false);


  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleReserve = () => {
    setShowModal(true);
  };

  const confirmReserve = () => {
    setShowModal(false);
    if (activityData && activityData.booking_flag) {
      alert('Activity reserved successfully!');
    } else {
      alert('Activity is not available for reservation!');
    }
  };

  const getActivityById = async (id: string) => {
    // Fetch activity data by id
    const activity = await ActivityService.getActivityById(id);
    setActivityData(activity.activity.data);

  }
  useEffect(() => {
    getActivityById(id);
  }, [id]);
  
  const handleAdvertiserClick = () => {
    setShowAdvertiserModal(true);
  };

  const handleCloseAdvertiserModal = () => {
    setShowAdvertiserModal(false);
  };
  return (
    <Container className='mt-5'>
    <div className="activity-card">
      <div className="activity-details">
        <div className="image-placeholder">
          <i className="heart-icon"><FaRegHeart /></i>
        </div>
        <div className="details">
          <h2>Activity Name</h2>
          <p className="price">$50</p>
          <textarea className="description" placeholder="Title"></textarea>
          <button className="reserve-button">Reserve</button>
    <Container className='activity-card-container mt-5'>
      <div className="activity-card">
        <div className="activity-details">
          <div className="image-placeholder">
            <div className='mt-3'>
              <i onClick={toggleBookmark} style={{ cursor: 'pointer' }}>
                {isBookmarked ? <FaBookmark color="white" /> : <FaRegBookmark color='white' />}
              </i>
            </div>
          </div>
          <div className="details">
            <div className="d-flex align-items-center">
              <h2 className="me-3">{activityData ? activityData.name : ''}</h2>
              {activityData && (activityData.tags ?? []).map((tag, index) => (
                <Badge key={index} pill bg="tag" className="me-2 custom-badge">
                  {tag}
                </Badge>
              ))}

              <div className="d-flex align-items-center ms-5 rating-stars">
                {/* Rating Stars */}
                <div style={{ marginLeft: '12rem' }}>
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
                  {activityData ? activityData.average_rating : '0.0'}
                </Badge>
              </div>
            </div>
            <p className='Advertiser' onClick={handleAdvertiserClick} style={{ cursor: 'pointer', color:'#d76f30' , textDecoration:'underline'}}>{Data?.advertiser.name}</p>
            <p className='Category'>{activityData?.category}</p>
            <p className="date">{activityData?.date ? new Date(activityData.date).toLocaleDateString() : 'Date not available'}</p>
            <p className="time">{activityData?.time}</p>
            <p className="price">${activityData?.price}</p>

            <div className="d-flex justify-content-center">
              <button className="reserve-button" onClick={handleReserve}>Reserve</button>
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
          <p><strong>Activity Name:</strong> {activityData?.name}</p>
          <p><strong>Date:</strong> {activityData?.date ? new Date(activityData.date).toLocaleDateString() : 'Date not available'}</p>
          <p><strong>Time:</strong> {activityData?.time}</p>
          <p><strong>Price:</strong> ${activityData?.price}</p>
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
          <img src={Data?.advertiser.photo} alt="Advertiser" />
          <p><strong>Name:</strong> {Data?.advertiser.name}</p>
          <p><strong>ID:</strong> {Data?.advertiser.email}</p>
          <p><strong>Phone:</strong> {Data?.advertiser.phone}</p>
          <p><strong>Location:</strong> {Data?.advertiser.location.latitude}, {Data?.advertiser.location.longitude}</p>

          
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