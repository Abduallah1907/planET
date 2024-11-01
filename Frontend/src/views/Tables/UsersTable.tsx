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
import UserService from "../../services/UserService";
import UserStatus from "../../types/userStatus";

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
  const [showDocModal, setShowDocModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]); // Array to hold document URLs

  const handleDelete = (email: string) => {
    setUserToDelete(email);
    setShowModal(true);
  };

  const getUsers = async (page: number) => {
    const response = await AdminService.getUsers(page);
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
  };

  const updateViewableUsers = () => {
    const usersForPage = users.get(page) || [];
    setViewableUsers(usersForPage);
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

      for (let [key, value] of newUsers) {
        if (value.length === 0) {
          newUsers.delete(key);
        }
      }

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
    updateViewableUsers();
  }, [users, page, updateViewableUsers]); // Added updateViewableUsers here

  const totalPages = Math.ceil((totalUsers + 1) / usersPerPage);

  const handleView = async (user: IUserManagmentDTO) => {
    try {
      const { _id: user_id, role } = user;
      const userDocuments = await UserService.getDocuments(user_id, role);

      if (userDocuments.data && userDocuments.data.length > 0) {
        setSelectedUser(user.email);

        const urls = await Promise.all(
          userDocuments.data.map(async (docId: string) => {
            const blob = await FileService.downloadFile(docId);
            // Create a Blob URL if it's a Blob
            const fileUrl = URL.createObjectURL(blob);
            console.log("File URL for docId:", docId, "is", fileUrl);
            return fileUrl;
          })
        );

        // Filter out any null URLs
        const validUrls = urls.filter((url) => url);
        setDocumentUrls(validUrls);

        setShowDocModal(true);
      } else {
        console.error("No documents returned or incorrect format");
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };
  const handleAccept = async (email: string | null) => {
    if (email) {
      try {
        const response = await UserService.acceptUser(email);
        console.log(response.data); // Handle the successful response
        setShowDocModal(false); // Close the modal after action
        getUsers(page); // Refresh the users list
      } catch (error) {
        console.error("Error accepting user:", error);
      }
    }
  };

  const handleReject = async (email: string | null) => {
    if (email) {
      try {
        const response = await UserService.rejectUser(email);
        console.log(response.data); // Handle the successful response
        setShowDocModal(false); // Close the modal after action
        getUsers(page); // Refresh the users list
      } catch (error) {
        console.error("Error rejecting user:", error);
      }
    }
  };

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
                  user.status === UserStatus.APPROVED ? "active-row" : "closed-row"
                }
              >
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Badge
                    bg={user.status === UserStatus.APPROVED ? "success" : (user.status === UserStatus.REJECTED ? "danger" : "warning")}
                    className="mt-2 custom-status-badge rounded-4 text-center"
                  >
                    {user.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="mt-2 me-2"
                    onClick={() => handleDelete(user.email)}
                  >
                    Delete
                  </Button>
                  {user.status === UserStatus.WAITING_FOR_APPROVAL && (
                  <Button variant="main-inverse" className="mt-2" onClick={() => handleView(user)}>
                    View Doc
                  </Button>
                  )}
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
          <Button variant="primary" onClick={confirmDelete}>
            Confirm
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
        <Modal.Header closeButton>
          <Modal.Title>
            Documents for {selectedUser}
            <div className="mt-2">
              <Button
                variant="success"
                className="me-2"
                onClick={() => handleAccept(selectedUser)}
              >
                Accept
              </Button>
              <Button
                variant="danger"
                onClick={() => handleReject(selectedUser)}
              >
                Reject
              </Button>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {documentUrls.length > 0 ? (
            <div>
              {documentUrls.map((url, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <iframe
                    src={url}
                    title={`Document Viewer ${index + 1}`}
                    style={{ width: "80%", height: "400px", border: "none" }} // Adjust these values as needed
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

export default UsersTable;
