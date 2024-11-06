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
import "./UsersTable.css";
import { TouristService } from "../../services/TouristService";
import { FileService } from "../../services/FileService";
import { useAppSelector } from "../../store/hooks";
import Rating from "../../components/Rating/Rating";
import CustomFormGroup from "../../components/FormGroup/FormGroup";
import Comment from "../../components/Comment";

const TourGuidesTable = () => {
  const [users, setUsers] = useState<Map<number, any[]>>(new Map());
  const tourist = useAppSelector((state) => state.user);
  const [viewableUsers, setViewableUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');

  const getTourGuides = async () => {
    try {
      const response = await TouristService.getMyTourGuides(
        tourist.stakeholder_id._id
      );

      if (response && response.data) {
        if (response.data.length === 0) {
          console.log("No tour guides found for this tourist.");
          setViewableUsers([]);
          setTotalUsers(0);
        } else {
          const usersWithImages = await Promise.all(
            response.data.map(async (tourGuide: any) => {
              if (tourGuide.logo) {
                // Assuming logo is the image field
                const file = await FileService.downloadFile(tourGuide.logo);
                const url = URL.createObjectURL(file);
                return { ...tourGuide, logoUrl: url }; // Add image URL
              }
              return tourGuide;
            })
          );

          setUsers((prevUsers) => {
            const newUsers = new Map(prevUsers).set(page, usersWithImages);
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
      console.log("Tourist ID:", tourist._id);
      getTourGuides();
    }
  }, [tourist]);

  const updateViewableUsers = () => {
    const usersForPage = users.get(page) || [];
    console.log("Users for current page:", usersForPage);
    setViewableUsers(usersForPage);
  };
  const handleCommentSubmit = async (sentData: { comment: string; rating: number }) => {
    const data = { tour_guide_email: selectedEmail, comment: sentData.comment, rating: sentData.rating };
    await TouristService.rateAndCommentTourGuide(tourist.stakeholder_id._id, data);
  };

  useEffect(() => {
    updateViewableUsers();
  }, [users, page]);



  const totalPages = Math.ceil(totalUsers / usersPerPage);
  console.log("Total Pages:", totalPages);

  const handleRate = (email: string) => {
    setShowRateModal(true);
    setSelectedEmail(email);
  };
  const handleCloseRate = () => {
    setShowRateModal(false);
  };

  return (
    <Container className="profile-form-container">
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Tour Guides Table</h2>
        </Col>
      </Row>
      <div className="table-container">
        <Table className="w-100">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Itinerary Name</th>
              <th>Logo</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {viewableUsers.length > 0 ? (
              viewableUsers.map((tour_guide) => (
                <tr key={tour_guide._id}>
                  <td>{tour_guide.email}</td>
                  <td>{tour_guide.firstName}</td>
                  <td>{tour_guide.iternary_name}</td>
                  <td>
                    {tour_guide.logoUrl && (
                      <img
                        src={tour_guide.logoUrl} // Use the new logoUrl field
                        alt="Logo"
                        style={{ width: "150px" }}
                      />
                    )}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="main-inverse"
                      className="mt-3 m1-2"
                      onClick={() => handleRate(tour_guide.email)}
                    >
                      Rate
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
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
          <Button variant="main-inverse" onClick={() => setShowModal(false)}>
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
          <Button variant="main-inverse" onClick={() => setShowDocModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showRateModal}
        onHide={() => setShowRateModal(false)}
        centered
      >
        <Modal.Body>
          <Comment onSubmit={handleCommentSubmit}/>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="main-inverse"
            className="mt-3 m1-2"
            onClick={handleCloseRate}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TourGuidesTable;
