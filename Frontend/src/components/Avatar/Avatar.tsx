import { useAppSelector, useAppDispatch } from "../../store/hooks";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, Image, Modal } from "react-bootstrap";
import "./avatar.css";
import { setLoginState } from "../../store/userSlice";
import {
  closeSidebar,
  disableSidebar,
  setNavItems,
} from "../../store/sidebarSlice";
import { TouristService } from "../../services/TouristService";
import { AdvertiserService } from "../../services/AdvertiserService";
import { SellerServices } from "../../services/SellerServices";
import { TourGuideServices } from "../../services/TourGuideServices";

const Avatar: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(setLoginState(false));
    dispatch(disableSidebar());
    dispatch(closeSidebar());
    dispatch(setNavItems([]));
    navigate("/");
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteRequest = () => {
    setShowDeleteModal(true); // Open the delete confirmation modal
  };

  const handleDelete = async () => {
    try {
      // Attempt to delete the account based on user role
      switch (user.role) {
        case "TOURIST":
          await TouristService.deleteTourist(user.email);
          break;
        case "ADVERTISER":
          await AdvertiserService.deleteAdvertiser(user.email);
          break;
        case "SELLER":
          await SellerServices.deleteSellerServices(user.email);
          break;
        case "TOUR_GUIDE":
          await TourGuideServices.deleteTourGuide(user.email);
          break;
        default:
          throw new Error("Unknown role");
      }

      // Clear user data and navigate only if deletion was successful
      localStorage.removeItem("user");
      dispatch(setLoginState(false));
      dispatch(disableSidebar());
      dispatch(closeSidebar());
      dispatch(setNavItems([]));
      navigate("/");
    } catch (error) {
      console.error("Account deletion failed:", error);
      // Optionally display a toast notification for error handling
    } finally {
      setShowDeleteModal(false); // Close the modal after deletion attempt
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Close modal without any action
  };

  return (
    <Dropdown drop="down" align="end" className="px-2">
      <Dropdown.Toggle
        variant="secondary"
        style={{ backgroundColor: "#D3D3D3" }}
        id="avatar-dropdown"
        className="custom-dropdown-toggle"
      >
        <Image
          src="https://i.pinimg.com/564x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"
          roundedCircle
          width="30"
          height="30"
        />
      </Dropdown.Toggle>
      <Dropdown.Menu className="custom-dropdown-menu">
        <Dropdown.Item as={Link} to={`/${user.role.toLowerCase()}/Profile`}>
          Profile
        </Dropdown.Item>
        {(user.role === "TOURIST" ||
          user.role === "TOUR_GUIDE" ||
          user.role === "ADVERTISER" ||
          user.role === "SELLER") && (
          <Dropdown.Item>
            <Button
              variant="danger"
              onClick={handleDeleteRequest}
              className="w-100"
            >
              Delete Account
            </Button>
          </Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item>
          <Button variant="danger" onClick={handleLogout} className="w-100">
            Logout
          </Button>
        </Dropdown.Item>
      </Dropdown.Menu>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete your account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Dropdown>
  );
};

export default Avatar;
