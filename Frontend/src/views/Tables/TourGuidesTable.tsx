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
import { IUserManagmentDTO } from "../../types/IUser";
import "./UsersTable.css";
import UserStatus from "../../types/userStatus";
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";

const TourGuidesTable = () => {
  const [users, setUsers] = useState<Map<number, IUserManagmentDTO[]>>(
    new Map()
  );
  const tourist = useAppSelector((state) => state.user);
  const [viewableUsers, setViewableUsers] = useState<IUserManagmentDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getTourGuides = async () => {
    try {
      const response = await TouristService.getMyTourGuides(tourist._id);

      if (response && response.data) {
        if (response.data.length === 0) {
          console.log("No tour guides found for this tourist.");
          setViewableUsers([]); // Clear users if none found
          setTotalUsers(0); // Reset total users
        } else {
          setUsers((prevUsers) => {
            const newUsers = new Map(prevUsers).set(page, response.data);
            setTotalUsers(
              Array.from(newUsers.values()).reduce(
                (acc, users) => acc + users.length,
                0
              )
            );
            return newUsers;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching tour guides:", error);
      setErrorMessage("Error fetching tour guides. Please try again later.");
    }
  };

  useEffect(() => {
    if (tourist && tourist._id) {
      console.log("Tourist ID:", tourist._id); // Log tourist ID
      getTourGuides();
    }
  }, [tourist]);

  const updateViewableUsers = () => {
    const usersForPage = users.get(page) || [];
    console.log("Users for current page:", usersForPage); // Log users for the page
    setViewableUsers(usersForPage);
  };

  useEffect(() => {
    updateViewableUsers();
  }, [users, page]);

  const totalPages = Math.ceil(totalUsers / usersPerPage);
  console.log("Total Pages:", totalPages);

  return (
    <Container className="profile-form-container">
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
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
            {viewableUsers.length > 0 ? (
              viewableUsers.map((user) => (
                <tr
                  key={user._id}
                  className={
                    user.status === UserStatus.APPROVED
                      ? "active-row"
                      : "closed-row"
                  }
                >
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <Badge
                      bg={
                        user.status === UserStatus.APPROVED
                          ? "success"
                          : user.status === UserStatus.REJECTED
                          ? "danger"
                          : "warning"
                      }
                      className="mt-2 custom-status-badge rounded-4 text-center"
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td>
                    {/* Action buttons can be added here, e.g., delete or view documents */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  {totalUsers === 0
                    ? "No tour guides available for this tourist."
                    : "No tour guides found."}
                </td>
              </tr>
            )}
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
                onClick={() => totalUsers > 0 && setPage(index + 1)}
                className="custom-pagination-item"
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
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDocModal}
        onHide={() => {
          setShowDocModal(false);
          setDocumentUrls([]); // Clear document URLs when closing
        }}
        size="lg"
        centered
      >
        <Modal.Body>
          {documentUrls.length > 0 ? (
            <div>
              {documentUrls.map((url, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <iframe
                    src={url}
                    title={`Document Viewer ${index + 1}`}
                    style={{ width: "80%", height: "400px", border: "none" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No documents available for this user.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDocModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TourGuidesTable;
