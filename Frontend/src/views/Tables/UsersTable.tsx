import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Modal,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { AdminService } from "../../services/AdminService";
import { IUserManagmentDTO } from "../../types/IUser";
import "./UsersTable.css";
import { FileService } from "../../services/FileService";
import Advertiser from "../../components/ProfileForm/Advertiser";

const UsersTable = () => {
  const [users, setUsers] = useState<Map<number, IUserManagmentDTO[]>>(
    new Map()
  );
  const [viewableUsers, setViewableUsers] = useState<IUserManagmentDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedUserDocs, setSelectedUserDocs] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleDelete = (email: string) => {
    setUserToDelete(email);
    setShowModal(true);
  };

  const getUsers = async (page: number) => {
    const response = await AdminService.getUsers(page);
    setUsers((prevUsers) => {
      const newUsers = new Map(prevUsers).set(page, response.data); // Append new users
      setTotalUsers(
        Array.from(newUsers.values()).reduce(
          (acc, users) => acc + users.length,
          0
        )
      ); // Update total users count
      return newUsers;
    });
  };

  const updateViewableUsers = () => {
    const usersForPage = users.get(page) || [];
    setViewableUsers(usersForPage); // Update viewable users based on current page
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete);
    }
    setShowModal(false);
  };

  const deleteUser = async (email: string) => {
    await AdminService.deleteUser(email);
    setUsers((prevUsers) => {
      const newUsers = new Map(prevUsers);
      let pageNum = 1;

      // Remove the user from the map and shift users to maintain page length
      while (newUsers.has(pageNum)) {
        const userList = newUsers
          .get(pageNum)!
          .filter((user) => user.email !== email);
        if (userList.length < usersPerPage && newUsers.has(pageNum + 1)) {
          const nextPageUsers = newUsers.get(pageNum + 1)!;
          if (nextPageUsers.length > 0) {
            userList.push(nextPageUsers.shift()!);
            newUsers.set(pageNum + 1, nextPageUsers);
          }
        }
        newUsers.set(pageNum, userList);
        pageNum++;
      }

      // Remove empty pages
      for (let [key, value] of newUsers) {
        if (value.length === 0) {
          newUsers.delete(key);
        }
      }

      // Update total users count
      setTotalUsers(
        Array.from(newUsers.values()).reduce(
          (acc, users) => acc + users.length,
          0
        )
      );

      return newUsers;
    });
  };

  useEffect(() => {
    getUsers(page);
  }, [page]);

  useEffect(() => {
    updateViewableUsers(); // Update viewable users whenever users or page changes
  }, [users, page]);

  const totalPages = Math.ceil((totalUsers + 1) / usersPerPage);

  const handleView = async (role: string) => {};

  return (
    <Container className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Users Table</h2>
        </Col>
      </Row>
      <div className="table-container">
        <Table className="w-100">
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
                className={
                  user.status === "Active" ? "active-row" : "closed-row"
                }
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
                  <Button
                    className="mt-2 "
                    onClick={() => handleView(user.email)}
                  >
                    View Doc
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
      {/* Modal for Viewing Documents */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Documents for {selectedUser}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUserDocs.length > 0 ? (
            selectedUserDocs.map((doc, index) => (
              <iframe
                key={index}
                src={doc}
                width="100%"
                height="500px"
                title={`Document ${index + 1}`}
                style={{ marginBottom: "10px" }}
              />
            ))
          ) : (
            <p>No documents available for this user.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UsersTable;
