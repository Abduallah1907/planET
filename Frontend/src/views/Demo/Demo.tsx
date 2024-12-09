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
import Activity1 from '../../assets/Activity-1.png';
import Activity2 from '../../assets/Activity-2.png';
import Activity3 from '../../assets/Activity-3.png';
import Activity4 from '../../assets/Activity-4.png';
import Activity5 from '../../assets/Activity-5.png';
import buy1 from '../../assets/buy-1.png';
import buy2 from '../../assets/buy-2.png';
import buy3 from '../../assets/buy-3.png';
import buy4 from '../../assets/buy-4.png';
import buy5 from '../../assets/buy-5.png';
import it1 from '../../assets/it-1.png';
import it2 from '../../assets/it-2.png';
import it3 from '../../assets/it-3.png';
import it4 from '../../assets/it-4.png';
import it5 from '../../assets/it-5.png';
import it6 from '../../assets/it-6.png';
import it7 from '../../assets/it-7.png';
import it8 from '../../assets/it-8.png';




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
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 1 : Press on Activity</h5>
              <img src={Activity1} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 2 : Choose preferred Activity and Press on its Card</h5>
              <img src={Activity2} alt="Hotel 2" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 3 : Press on the Reserve Button</h5>
              <img src={Activity3} alt="Hotel 3" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 4 : Check details of the Activity then Press Confirm</h5>
              <img src={Activity4} alt="Hotel 3" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 5 : Choose payemnt method then Press on Confirm Payment </h5>
              <img src={Activity5} alt="Hotel 3" className="img-fluid mb-3 img-border" />
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header style={{ fontFamily: 'Poppins', color:'#FFFFFF'}}>Reserve an Itinerary</Accordion.Header>
          <Accordion.Body>
            <div className="text-center">
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 1 : Press on Itineraries</h5>
              <img src={it1} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 2 : Choose preferred Itinerarie and Press on its Card</h5>
              <img src={it2} alt="Hotel 2" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 3 : Press on View Available Dates to Check suitable dates</h5>
              <img src={it3} alt="Hotel 3" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 4 : Press on the dates you prefer</h5>
              <img src={it4} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 5 : Press on View Timeline to Check timeline of the Itineraries</h5>
              <img src={it5} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 6 : Press on the Reserve Button</h5>
              <img src={it6} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 7 : Check details of the Itineraries then Press Confirm</h5>
              <img src={it7} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 8 : Choose payemnt method then Press on Confirm Payment </h5>
              <img src={it8} alt="Hotel 1" className="img-fluid mb-3 img-border" />
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header style={{ fontFamily: 'Poppins', color:'#FFFFFF'}}>Buy a Product</Accordion.Header>
          <Accordion.Body>
            <div className="text-center">
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 1 : Press on Products</h5>
              <img src={buy1} alt="Hotel 1" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 2 : Press on Add to Cart Button for the Product you want</h5>
              <img src={buy2} alt="Hotel 2" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 3 : after selecting all Products press on Cart Icon</h5>
              <img src={buy3} alt="Hotel 3" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 4 : Press on + or - icons to Increase or Decrease the Quantity of the Product </h5>
              <h5  style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 5 : Check Order Summary then Press on Checkout</h5>
              <img src={buy4} alt="Hotel 3" className="img-fluid mb-3 img-border" />
              <h5 className="mt-5" style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 6 : Add your Contact information and Choose Payment method </h5>
              <h5  style={{ fontFamily: 'Poppins', color:'#000000'}}>Step 7 : Check Order Summary then Press on Confirm Order </h5>
              <img src={buy5} alt="Hotel 3" className="img-fluid mb-3 img-border" />
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default Demo;