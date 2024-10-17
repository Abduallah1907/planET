import React from 'react';
import './AdminDash.css';
import { FaUser } from 'react-icons/fa';
import { FaPlane } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { HiOutlineTrendingDown, HiOutlineTrendingUp } from 'react-icons/hi';
import { Badge, Card, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const stats = [
  { title: 'Total User', value: '40,689', icon: <FaUser />, percentage: '8.5%', direction: 'up' },
  { title: 'Total Trips', value: '10,293', icon: <FaPlane />, percentage: '1.3%', direction: 'up' },
  { title: 'Total Sellers', value: '200', icon: <MdSell />, percentage: '4.3%', direction: 'down' },
  { title: 'Total Pending Accounts', value: '2040', icon: <MdOutlineManageAccounts />, percentage: '1.8%', direction: 'up' },
];

const StatisticsCards = () => {
  const { t } = useTranslation();
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

export default StatisticsCards;
