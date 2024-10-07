import React from 'react';
import '../TourGuideDashboard/TourGuidedashboard.css';

const trips = [
  { flight: 'MS731', destination: 'Cairo-Egypt', date: '12.09.2019', time: '12:53 PM', piece: 423, duration: '3 Hrs', status: 'Arrived' },
  { flight: 'MS732', destination: 'Berlin-Germany', date: '12.09.2019', time: '12:53 PM', piece: 423, duration: '6 Hrs', status: 'Boarding' },
  { flight: 'MS741', destination: 'Barcelona-Spain', date: '12.09.2019', time: '12:53 PM', piece: 423, duration: '2 Hrs', status: 'Cancelled' },
];

const TripDetailsTable = () => {
  return (
    <div className="country-campaign-table">
      <h4 className='dashl'>Trip Details</h4>
      <table className="trip-table">
        <thead>
          <tr className='row-color'>
            <th>Flight Number</th>
            <th>Destination</th>
            <th>Date - Time</th>
            <th>Piece</th>
            <th>Flight Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr key={index}>
              <td>{trip.flight}</td>
              <td>{trip.destination}</td>
              <td>{trip.date} - {trip.time}</td>
              <td>{trip.piece}</td>
              <td>{trip.duration}</td>
              <td className={`status-label ${trip.status.toLowerCase()}`}>{trip.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripDetailsTable;
