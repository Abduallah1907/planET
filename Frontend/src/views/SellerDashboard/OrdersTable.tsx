import React from 'react';
import '../TourGuideDashboard/TourGuidedashboard.css';
import './OrdersTable.css';
import { Badge } from 'react-bootstrap';

const trips = [
  { Product_Number: 'MS731', Description: 'IPHONE 4', Date_Time: '12:53 PM_12.09.2009', Price: '5000EGP', status: 'Arrived' },
  { Product_Number: 'MS732', Description: 'IPHONE 5', Date_Time: '12:54 PM_12.09.2010', Price: '6000EGP', status: 'Active' },
  { Product_Number: 'MS733', Description: 'IPHONE 6', Date_Time: '12:55 PM_12.09.2011', Price: '7000EGP', status: 'Cancelled' },
  { Product_Number: 'MS734', Description: 'IPHONE 7', Date_Time: '12:56 PM_12.09.2019', Price: '8000EGP', status: 'Arrived' },
  { Product_Number: 'MS735', Description: 'IPHONE 8', Date_Time: '12:57 PM_12.09.2019', Price: '9000EGP', status: 'Arrived' },
  { Product_Number: 'MS736', Description: 'IPHONE 9', Date_Time: '12:58 PM_12.09.2018', Price: '10000EGP', status: 'Active' },
  { Product_Number: 'MS737', Description: 'IPHONE X', Date_Time: '00:00 PM_12.09.2017', Price: '11000EGP', status: 'Cancelled' },
  

];

const TripDetailsTable = () => {
  return (
    <div className="country-campaign-table">
      <h4 className='dashl'>Orders</h4>
      <table className="trip-table">
        <thead>
          <tr className='row-color'>
            <th>Product Number</th>
            <th>Description</th>
            <th>Date - Time</th>
            <th>Price</th>
            <th className='text-center'>Status</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr key={index}>
              <td>{trip.Product_Number}</td>
              <td>{trip.Description}</td>
              <td>{trip.Date_Time}</td>
              <td>{trip.Price}</td>
              <td className='text-center'>
                <Badge
                  bg=""
                  className={`stat-label p-2 px-3 rounded-5 ${trip.status.toLowerCase()}`}
                >{trip.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripDetailsTable;
