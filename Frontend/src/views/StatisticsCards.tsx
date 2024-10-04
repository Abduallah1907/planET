import React, { CSSProperties } from 'react';

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
          <h4>{stat.title}</h4>
          <p>{stat.value}</p>
          <small style={stat.direction === 'up' ? styles.green : styles.red}>
            {stat.percentage} {stat.direction === 'up' ? 'Up' : 'Down'}
          </small>
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '20px 0',
  },
  card: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '200px',
    textAlign: 'center',
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
};

export default StatisticsCards;
