import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import FullEurope from '../../assets/FullEurope.png'; // Ensure this path is correct
import Rome from '../../assets/Rome.png'; // Ensure this path is correct
import London from '../../assets/London.png'; // Ensure this path is correct
import './destinations.css'; // Import the custom CSS file

const destinations = [
  {
    image: Rome,
    city: 'Rome, Italy',
    duration: '10 Days Trip',
    price: '$5,42k',
  },
  {
    image: London,
    city: 'London, UK',
    duration: '12 Days Trip',
    price: '$4.2k',
  },
  {
    image: FullEurope,
    city: 'Full Europe',
    duration: '28 Days Trip',
    price: '$15k',
  },
];

const Destinations: React.FC = () => {
  return (
    <Container className='dest-container'>
      <Row>
        {destinations.map((destination, index) => (
          <Col md={4} key={index}>
            <Card className="mb-4 border-0">
             <Card.Img variant="top" className='rounded-4' src={destination.image} />
                <Card.Body className="card-content rounded-4">
                  <Card.Title>{destination.city}</Card.Title>
                  <Card.Text>
                    {destination.duration}

                    {destination.price}
                  </Card.Text>
                </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Destinations;