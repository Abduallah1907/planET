import React from 'react';
import '../TourGuideDashboard/TourGuidedashboard.css';
import { useTranslation } from 'react-i18next';
import { Badge } from 'react-bootstrap';
const trips = [
  { flight: 'MS731', destination: 'Cairo-Egypt', date: '12.09.2019', time: '12:53 PM', piece: 423, duration: '3 Hrs', status: 'Arrived' },
  { flight: 'MS732', destination: 'Berlin-Germany', date: '12.09.2019', time: '12:53 PM', piece: 423, duration: '6 Hrs', status: 'Boarding' },
  { flight: 'MS741', destination: 'Barcelona-Spain', date: '12.09.2019', time: '12:53 PM', piece: 423, duration: '2 Hrs', status: 'Cancelled' },
];

const TripDetailsTable = () => {
  const { t } = useTranslation();
  return (
    <div className="country-campaign-table">
      <h4 className='dashl'>{t('trip_details')}</h4>
      <table className="trip-table">
        <thead>
          <tr className='row-color'>
          <th>{t('flight_number')}</th>
            <th>{t('destination')}</th>
            <th>{t('date_time')}</th>
            <th>{t('piece')}</th>
            <th>{t('flight_time')}</th>
            <th>{t('status')}</th>
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
              <td>
                <Badge
                  bg=""
                  className={`status-label p-2 px-3 rounded-5 ${trip.status.toLowerCase()}`}
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
