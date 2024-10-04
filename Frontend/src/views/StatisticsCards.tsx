import React, { CSSProperties } from 'react';
import { HiOutlineTrendingDown, HiOutlineTrendingUp } from 'react-icons/hi';

const stats = [
  { title: 'Today Views', value: '40,689', percentage: '8.5%', direction: 'up' },
  { title: 'Completed Tours', value: '10,293', percentage: '1.3%', direction: 'up' },
  { title: 'Active Users', value: '200', percentage: '4.3%', direction: 'down' },
  { title: 'Earning Money', value: '2040$', percentage: '1.8%', direction: 'up' },
];

const StatisticsCards = () => {
  return (
    <div style={styles.container}>
      {stats.map((stat, index) => (
        <div key={index} style={styles.card}>
          <h4 className='cards'>{stat.title}</h4>
          <p className='dash'>{stat.value}</p>
          <small style={stat.direction === 'up' ? styles.green : styles.red}>
            {stat.percentage} {stat.direction === 'up' ? <HiOutlineTrendingUp /> : <HiOutlineTrendingDown />}
            <small className='chart-time'> from last week</small>
          </small>
        </div>
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
