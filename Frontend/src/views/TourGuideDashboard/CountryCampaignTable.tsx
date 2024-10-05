import React from 'react';
import { Badge } from 'react-bootstrap';

const campaigns = [
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Active' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Active' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Active' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  { location: 'Cairo', package: 'Mazareta', type: 'Group', duration: '4D 3N', tourists: 13, amount: '20K EGP', status: 'Closed' },
  // Add more rows as needed
];

const CountryCampaignTable = () => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Location</th>
          <th>Package Name</th>
          <th>Type</th>
          <th>Duration</th>
          <th>Tourist</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((campaign, index) => (
          <tr key={index} style={campaign.status === 'Active' ? styles.activeRow : styles.closedRow}>
            <td>{campaign.location}</td>
            <td>{campaign.package}</td>
            <td>{campaign.type}</td>
            <td>{campaign.duration}</td>
            <td>{campaign.tourists}</td>
            <td>{campaign.amount}</td>
            <td>
                {(campaign.status === 'Active') ?
                    <Badge bg="success" style={{backgroundColor: "rgba()"}}>{campaign.status}</Badge>
                :
                    <Badge bg="danger">{campaign.status}</Badge>
                }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse' as 'collapse',
  },
  activeRow: {
    backgroundColor: '#fff',
  },
  closedRow: {
    backgroundColor: '#fff',
  },
};

export default CountryCampaignTable;
