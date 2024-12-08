import React from 'react';
import { Accordion, Container } from 'react-bootstrap';
import './Demo.css';
import bookFlight1 from '../../assets/bookFlight-1.png';
import bookFlight2 from '../../assets/bookFlight-2.png';
import bookFlight3 from '../../assets/bookFlight-3.png';
import bookFlight4 from '../../assets/bookFlight-4.png';
import bookHotel1 from '../../assets/bookHotel-1.png';
import bookHotel2 from '../../assets/bookHotel-2.png';
import bookHotel3 from '../../assets/bookHotel-3.png';

const Demo: React.FC = () => {
  return (
    <Container className="mt-5">
      <h2 className="text-center" style={{ fontFamily: 'Poppins', color: '#000000' }}>
        Demo
      </h2>
      <p style={{ fontFamily: 'Poppins', color:'#d76f30'}} className="text-center ">
        Click on the headers to expand the content.
      </p>

      <Accordion className="custom-accordion">
        {/* First Item */}
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ fontFamily: 'Poppins', color:'#FFFFFF'}}>Book a Flight</Accordion.Header>
          <Accordion.Body>
            <div className="text-center">
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 1 : Press on Flights</h5>
              <img src={bookFlight1} alt="Flight 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 2 : Fill in data then Press on Search button</h5>
              <img src={bookFlight2} alt="Flight 2" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 3 : Press on the Book Now button for the Flight you want</h5>
              <img src={bookFlight3} alt="Flight 3" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 4 : Fill in the Passenger Details then press Book button</h5>
              <img src={bookFlight4} alt="Flight 4" className="img-fluid mb-3 img-border" />
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Second Item */}
        <Accordion.Item eventKey="1">
          <Accordion.Header style={{ fontFamily: 'Poppins', color:'#FFFFFF'}}>Book a Hotel</Accordion.Header>
          <Accordion.Body>
            <div className="text-center">
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 1 : Press on Hotels</h5>
              <img src={bookHotel1} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 2 : Fill in data then Press on Search button</h5>
              <img src={bookHotel2} alt="Hotel 2" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 3 : Press on the Book Now button for the Hotel you want</h5>
              <img src={bookHotel3} alt="Hotel 3" className="img-fluid mb-3 img-border" />
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Additional Items */}
        <Accordion.Item eventKey="2">
          <Accordion.Header style={{ fontFamily: 'Poppins', color:'#FFFFFF'}}>Reserve an Activity</Accordion.Header>
          <Accordion.Body>
            <div className="text-center">
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 1</h5>
              <img src={bookHotel1} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 2</h5>
              <img src={bookHotel2} alt="Hotel 2" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 3</h5>
              <img src={bookHotel3} alt="Hotel 3" className="img-fluid mb-3 img-border" />
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header style={{ fontFamily: 'Poppins', color:'#FFFFFF'}}>Reserve an Itinerary</Accordion.Header>
          <Accordion.Body>
            <div className="text-center">
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 1</h5>
              <img src={bookHotel1} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 2</h5>
              <img src={bookHotel2} alt="Hotel 2" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 3</h5>
              <img src={bookHotel3} alt="Hotel 3" className="img-fluid mb-3 img-border" />
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header style={{ fontFamily: 'Poppins', color:'#FFFFFF'}}>Reserve an Historical Location</Accordion.Header>
          <Accordion.Body>
            <div className="text-center">
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 1</h5>
              <img src={bookHotel1} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 2</h5>
              <img src={bookHotel2} alt="Hotel 2" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 3</h5>
              <img src={bookHotel3} alt="Hotel 3" className="img-fluid mb-3 img-border" />
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="5">
          <Accordion.Header style={{ fontFamily: 'Poppins', color:'#FFFFFF'}}>Buy a Product</Accordion.Header>
          <Accordion.Body>
            <div className="text-center">
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 1</h5>
              <img src={bookHotel1} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 2</h5>
              <img src={bookHotel2} alt="Hotel 2" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Hotel 3</h5>
              <img src={bookHotel3} alt="Hotel 3" className="img-fluid mb-3 img-border" />
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default Demo;