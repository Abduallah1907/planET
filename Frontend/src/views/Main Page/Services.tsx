import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './services.css'; // Ensure this path is correct

const servicesData = [
  {
    icon: '📡', // Replace with actual icon component or image URL
    title: 'Calculated Weather',
    description: 'Built Wicket longer admire do barton vanity itself do in it.',
  },
  {
    icon: '✈️', // Replace with actual icon component or image URL
    title: 'Best Flights',
    description: 'Engrossed listening. Park gate sell they west hard for the.',
  },
  {
    icon: '🎤', // Replace with actual icon component or image URL
    title: 'Local Events',
    description: 'Barton vanity itself do in it. Preferd to men it engrossed listening.',
  },
  {
    icon: '⚙️', // Replace with actual icon component or image URL
    title: 'Customization',
    description: 'We deliver outsourced aviation services for military customers',
  },
];

const Services: React.FC = () => {
  return (
    <Container className='ser-container'>
      <h2 className="text-center font-weight-bold services-text ">We Offer Best Services</h2>
      <Row>
        {servicesData.map((service, index) => (
          <Col md={3} key={index}>
            <Card className="card-shadow">
              <Card.Body className="card-body rounded-4">
                <div className="card-icon">{service.icon}</div>
                <Card.Title>{service.title}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Services;