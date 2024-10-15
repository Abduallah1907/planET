import React, { useEffect, useState } from 'react';
import './ItineraryCardd.css';
import { Container, Badge, Modal, Button } from 'react-bootstrap';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { MdTimeline } from 'react-icons/md';
import Rating from '../components/Rating/Rating'; // Optional
import { useParams } from 'react-router-dom';
import { ItineraryService } from '../services/ItineraryService';




interface ItinerarysData{
  name: string;
  tags: string[];
  average_rating: number;
  tourGuide: {
    name: string;
  };
  category: string;
  availableDates: { date: string, time: string }[];
  price: number;
  timeline: string[];
} 

const ItineraryCardd: React.FC = () => {
  const {id} = useParams();
  
  // State to handle modals and bookmarking
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTourGuideModal, setShowTourGuideModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [itineraryData, setItineraryData] = useState<ItinerarysData> ({
    name: 'Itinerary Name',
    tags: ['Tag1', 'Tag2'],
    average_rating: 4.5,
    tourGuide: {
      name: 'Tour Guide Name'
    },
    category: 'Category',
    availableDates: [{ date: '2022-01-01', time: '10:00 AM' }],
    price: 100,
    timeline: ['Event 1', 'Event 2']
  });
  const [selectedDateTime, setSelectedDateTime] = useState({ date: '', time: '' }); // State for selected date and time

  // State for selected date and time
 
  // Function to toggle bookmark state
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Functions to open and close modals
  const handleDetailsModal = () => setShowDetailsModal(!showDetailsModal);
  const handleTourGuideModal = () => setShowTourGuideModal(!showTourGuideModal);
  const handleTimelineModal = () => setShowTimelineModal(!showTimelineModal);
  const handleDatesModal = () => setShowDatesModal(!showDatesModal);

  // Function to handle date selection
  const handleDateSelection = (dateObj: { date: string, time: string }) => {
    setShowDatesModal(false); // Close the dates modal
  };
  const getItineraryById = async (id: string) => {
    // Fetch itinerary data by id
    const itinerary = await ItineraryService.getItineraryById(id);
    setItineraryData(itinerary.data);
  }
  useEffect(() => {
    if (id) {
      getItineraryById(id);
    }
  }, [id]);
  return (
    <Container className='mt-3'>
      <div className="activity-card">
        <div className="activity-details">
          <div className="image-placeholder">
            {/* Placeholder for image if necessary */}
          </div>
          <div className="details">
            <div className="d-flex align-items-center">
              <h2 className="me-3">{itineraryData.name}</h2>
              {itineraryData && (itineraryData.tags ?? []).map((tag: any, index: number) => (
                <Badge key={index} pill bg="tag" className="me-2 custom-badge">
                  {tag.type}
                </Badge>
              ))}
              <div className="d-flex align-items-center ms-5 rating-stars">
                <div style={{ marginLeft: '12rem' }}>
                  <Rating rating={itineraryData.average_rating} readOnly={true} />
                </div>
                <Badge className="ms-2 review-badge text-center" style={{ fontSize: "1rem" }}>
                  {itineraryData.average_rating}
                </Badge>
              </div>
            </div>
            <p className='Category'>{itineraryData.category}</p>
            
            {/* <p className='date' onClick={handleTourGuideModal} style={{ cursor: 'pointer', color: '#d76f30' }}>
              {itineraryData.tourGuide.name}
            </p> */}
            
            <p className="date" onClick={handleDatesModal} style={{ cursor: 'pointer', color: '#d76f30' }}>
              View Available Dates
            </p>
            <p className="date" onClick={handleTimelineModal} style={{ cursor: 'pointer', color: '#d76f30' }}>
              View Timeline
            </p>
            <p className="price">${itineraryData.price}</p>

            <div className="d-flex justify-content-center">
              <button className="reserve-button" onClick={handleDetailsModal}>View Details</button>
            </div>

          </div>
        </div>
      </div>

      {/* Modal for Itinerary Details */}
      <Modal show={showDetailsModal} onHide={handleDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Itinerary Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Name:</strong> {itineraryData.name}</p>
          <p><strong>Category:</strong> {itineraryData.category}</p>
          <p><strong>Date & Time:</strong> {new Date(selectedDateTime.date).toLocaleDateString()} at {selectedDateTime.time}</p>
          <p><strong>Price:</strong> ${itineraryData.price}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Tour Guide Info */}
      <Modal show={showTourGuideModal} onHide={handleTourGuideModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tour Guide Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <p><strong>Name:</strong> {itineraryData.tourGuide.name}</p> */}
          <p><strong>Email:</strong> johndoe@example.com</p>
          <p><strong>Phone:</strong> +1 234-567-8901</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleTourGuideModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Timeline */}
      <Modal show={showTimelineModal} onHide={handleTimelineModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Itinerary Timeline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {itineraryData.timeline.map((event, index) => (
              <li key={index}><strong>{index + 1}:</strong> {event}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleTimelineModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Available Dates */}
      {/* <Modal show={showDatesModal} onHide={handleDatesModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Available Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {itineraryData.availableDates.map((dateObj, index) => (
              <li key={index} onClick={() => handleDateSelection(dateObj)} style={{ cursor: 'pointer', color: '#d76f30' }}>
                {new Date(dateObj.date).toLocaleDateString()} - {dateObj.time}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDatesModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </Container>
  );
};

export default ItineraryCardd;
