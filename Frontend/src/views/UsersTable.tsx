import React, { useState } from "react";
import { Badge, Button, Col, Row } from "react-bootstrap";
import "./UsersTable.css"; // Create a CSS file to store these styles

const initialUsers = [
  {
    email: "smksn@nsjc.com",
    username: "sbsjbkj",
    role: "SELLER",
    status: "Active",
  },
  {
    email: "example@domain.com",
    username: "user123",
    role: "ADMIN",
    status: "WFA",
  },
  {
    email: "example@domain.com",
    username: "user123",
    role: "ADMIN",
    status: "Rejected",
  },
  // Add more rows as needed
];

const UsersTable = () => {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  const handleUpdate = (index: number) => {
    // Add logic to update a user's information
    // console.log(`Update user at index ${index}`);
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading ">Users Table</h2>
        </Col>
      </Row>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className={
                  user.status === "Active" ? "active-row" : "closed-row"
                }
              >
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  {user.status === "Active" ? (
                    <Badge bg="success">{user.status}</Badge>
                  ) : (
                    <Badge bg="danger">{user.status}</Badge>
                  )}
                </td>
                <td>
                  <Button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
