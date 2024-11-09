import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './services.css'; // Ensure this path is correct
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  return (
    <Container className='ser-container'>
      <h2 className="text-center font-weight-bold services-text ">{t("we_offer_best_services")}</h2>
      <Row>
        {servicesData.map((service, index) => (
          <Col md={3} key={index}>
            <Card className={`${index === 1 ? 'card-shadow': ''} py-4 rounded-5`}>
              <Card.Body className="card-body">
                <div className="card-icon">{service.icon}</div>
                <Card.Title>{service.title}</Card.Title>
                <Card.Text className='mx-3'>
                  <Container>
                    <p>{service.description}</p>
                  </Container>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Services;