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
  const usersPerPage = 10; // Number of users to show per page
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Fetch all users from the backend
  const getUsers = async () => {
    const response = await AdminService.getUsers(1); // Get all users from the backend
    setUsers(response.data); // Store all users
    setTotalUsers(response.total); // Total number of users from the response
  };

  // Update the viewable users based on the current page
  const updateViewableUsers = (currentPage: number) => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    setViewableUsers(users.slice(startIndex, endIndex)); // Set the users for the current page
  };

  const handleDelete = (email: string) => {
    setUserToDelete(email);
    setShowModal(true);
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
    updateViewableUsers(page); // Update the viewable users after deletion
  };

  // Fetch users on mount
  useEffect(() => {
    getUsers();
  }, []);

  // Update viewable users when users or page changes
  useEffect(() => {
    updateViewableUsers(page);
  }, [users, page]);

  const totalPages = Math.ceil(totalUsers / usersPerPage); // Calculate total pages

  // Pagination control
  const renderPagination = () => {
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => setPage(i)} // Set the current page and update viewable users
        >
          {i}
        </Pagination.Item>
      );
    }
    return paginationItems;
  };

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

      {/* Pagination Slider */}
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          <Pagination.Prev
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
          />
          {renderPagination()}
          <Pagination.Next
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
          />
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
