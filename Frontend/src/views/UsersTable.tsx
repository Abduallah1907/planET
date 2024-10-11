import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Modal, Pagination, Row } from "react-bootstrap";
import { AdminService } from "../services/AdminService";
import { IUserManagmentDTO } from "../types/IUser";
import "./UsersTable.css";

const UsersTable = () => {
  const [users, setUsers] = useState<IUserManagmentDTO[]>([]);
  const [viewableUsers, setViewableUsers] = useState<IUserManagmentDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleDelete = (email: string) => {
    setUserToDelete(email);
    setShowModal(true);
  };

  const getUsers = async (page: number) => {
    const response = await AdminService.getUsers(page);
    setUsers((prevUsers) => [...prevUsers, ...response.data]); // Append new users
    setTotalUsers(response.total); // Update total users count
  };

  const updateViewableUsers = () => {
    const startIndex = (page - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    setViewableUsers(users.slice(startIndex, endIndex)); // Update viewable users based on current page
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete);
    }
    setShowModal(false);
  };

  const deleteUser = async (email: string) => {
    await AdminService.deleteUser(email);
    setUsers(users.filter((user) => user.email !== email));
  };
  
   
  useEffect(() => {
    getUsers(page);
  }, [page]);

  useEffect(() => {
    updateViewableUsers(); // Update viewable users whenever users or page changes
  }, [users, page]);

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Users Table</h2>
        </Col>
      </Row>
      <div className="table-container">
        <table className="w-100">
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
            {viewableUsers.map((user) => (
              <tr
                key={user._id}
                className={user.status === "Active" ? "active-row" : "closed-row"}
              >
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Badge
                    bg={user.status === "Approved" ? "success" : "warning"}
                    className="mt-2 custom-status-badge rounded-4 text-center"
                  >
                    {user.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    className="mt-2 bg-danger"
                    onClick={() => handleDelete(user.email)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center">
        <Pagination>
          {totalPages > 0 &&
            [...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === page}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
        </Pagination>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UsersTable;
