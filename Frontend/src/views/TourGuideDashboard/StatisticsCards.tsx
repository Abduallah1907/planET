import React, { CSSProperties } from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';
import { FaPlane, FaUser } from 'react-icons/fa';
import { HiOutlineTrendingDown, HiOutlineTrendingUp } from 'react-icons/hi';
import { MdOutlineManageAccounts, MdSell } from 'react-icons/md';

const stats = [
  { title: 'Today Views', value: '40,689', icon: <FaUser />, percentage: '8.5%', direction: 'up' },
  { title: 'Completed Tours', value: '10,293', icon: <FaPlane />, percentage: '1.3%', direction: 'up' },
  { title: 'Active Users', value: '200', icon: <MdSell />, percentage: '4.3%', direction: 'down' },
  { title: 'Earning Money', value: '2040$', icon: <MdOutlineManageAccounts />, percentage: '1.8%', direction: 'up' },
];

const StatisticsCards = () => {
  return (
    <div className="statistics-container">
      {stats.map((stat, index) => (
        <Card key={index} className="stat-card col-md-3">
          <Row>
            <Col>
              <h4>{stat.title}</h4>
              <p className="stat-value">{stat.value}</p>
            </Col>
            <div className='col-auto'>
              <Badge bg="icon" className='stat-icon'>
                {stat.icon}
              </Badge>
            </div>
          </Row>
          <Row className="align-items-end h-100">
            <small className={stat.direction === 'up' ? 'green-text' : 'red-text'}>
              {stat.direction === 'up' ? <HiOutlineTrendingUp /> : <HiOutlineTrendingDown />} {stat.percentage} 
              <small className='chart-time'> from last week</small>
            </small>
          </Row>
        </Card>
      ))}
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1.5rem',
    
  },
  card: {

    padding: '20px',
    border: '2px solid var(--main-color)',
    borderRadius: '8px',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'left',
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
};

export default StatisticsCards;
