import React from 'react';
import './ActivityCard.css';
import { Container } from 'react-bootstrap';
import { FaRegHeart } from 'react-icons/fa';

const ActivityCard: React.FC = () => {
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
        </div>
      </div>
    </div>
    </Container>
  );
};

export default ActivityCard;
