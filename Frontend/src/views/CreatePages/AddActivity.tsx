import React, { ChangeEvent, useEffect, useState } from "react";
import AdminFormGroup from "../../components/FormGroup/FormGroup"; // Adjust the path as necessary
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { BiChevronDown } from "react-icons/bi"; // Importing a dropdown icon from react-icons
import "../tagsinput.css";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { ActivityService } from "../../services/ActivityService";
import CategoryService from "../../services/CategoryService";
import { AdminService } from "../../services/AdminService";
import { ToastTypes } from "../../utils/toastTypes";
import { FileService } from "../../services/FileService";
import showToastMessage from "../../utils/showToastMessage";
import MapModal from "../../components/MapModal";

// Other interface and component definitions...

interface FormData {
  name: string;
  tags: string;
  suggestions: string;
  date: string;
  time: string;
  special_discount: number;
  price: number;
  active_flag: boolean;
  booking: boolean;
  category: string;
  image: File | null;
}

interface Tag {
  _id: string;
  type: string;
}

interface Category {
  _id: string;
  type: string;
}

const AdvertiserCreate: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    tags: "",
    suggestions: "",
    date: "",
    time: "",
    special_discount: 0,
    price: 0,
    active_flag: true,
    booking: true,
    category: "",
    image: null,
  });
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showMapModal, setShowMapModal] = useState(false); // State to manage modal visibility

  const [center, setCenter] = React.useState({
    lat: 29.98732507495249,
    lng: 31.435660077332482,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "booking") {
      setFormData({
        ...formData,
        [name]: value === "Open",
      });
    } else {
      const updatedValue = type === "checkbox" ? checked : value;

      // Ensure special_discount and price do not accept negative values
      if (
        (name === "special_discount" || name === "price") &&
        Number(updatedValue) < 0
      ) {
        showToastMessage("Value cannot be negative", ToastTypes.ERROR);
        setFormData({
          ...formData,
          [name]: 0,
        });
      } else {
        setFormData({
          ...formData,
          [name]: updatedValue,
        });
      }
    }
  };

  const handleAddLocation = () => {
    setShowMapModal(true); // Show the modal
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false); // Close the modal
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      const tag = inputValue.trim();
      if (tag && !tags.some((t) => t.type === tag)) {
        alert("Invalid tag");
        setInputValue("");
        return;
      }
      const foundTag = tags.find((t) => t.type === tag);
      if (foundTag && !selectedTags.some((t) => t._id === foundTag._id)) {
        setSelectedTags((prev) => [...prev, foundTag]);
        setInputValue("");
      }
    }
  };

  const handleDeleteTag = (tagToDeleteID: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag._id !== tagToDeleteID));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const foundTag = tags.find((t) => t.type === suggestion);
    if (foundTag && !selectedTags.some((t) => t._id === foundTag._id)) {
      setSelectedTags((prev) => [...prev, foundTag]);
      setSuggestions((prev) => prev.filter((s) => s !== suggestion));
      setInputValue("");
    }
  };

  useEffect(() => {
    if (inputValue.startsWith("#")) {
      const filteredTags = tags.filter((tag: Tag) =>
        tag.type.toLowerCase().includes(inputValue.slice(1).toLowerCase())
      );
      const selectedTagIds = new Set(selectedTags.map((tag) => tag._id));
      const filteredSuggestions = filteredTags.filter(
        (tag) => !selectedTagIds.has(tag._id)
      );
      setSuggestions(filteredSuggestions.map((tag) => tag.type));
    } else {
      setSuggestions([]);
    }
  }, [inputValue, tags]);

  const getAllCategories = async () => {
    try {
      const response = await CategoryService.getCategoryById(1); // Replace with appropriate API call
      const categoryData = response.data.map((category: any) => {
        return {
          _id: category._id,
          type: category.type,
        };
      });
      setCategories(categoryData); // Assuming the response has 'data' containing the categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getTags = async (page: number) => {
    const tagsData = await AdminService.getTags(page); // Assuming page 1 as the default
    setTags(tagsData.data);
  };

  useEffect(() => {
    getTags(1);
    getAllCategories();
  }, []);

  const AdvertiserId = useAppSelector((state) => state.user.stakeholder_id._id);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (center.lat === 29.98732507495249 && center.lng === 31.435660077332482) {
      setShowMapModal(true);
      return;
    }
    const activityData = {
      name: formData.name,
      date: formData.date,
      time: formData.time,
      category: formData.category,
      location: { longitude: center.lng, latitude: center.lat },
      price: formData.price,
      tags: selectedTags.map((tag) => tag._id),
      special_discount: formData.special_discount,
      active_flag: formData.active_flag,
      booking_flag: formData.booking, // Correctly assigning booking_flag
      advertiser_id: AdvertiserId,
    };
    if (AdvertiserId) {
      await ActivityService.createActivity(activityData);
      navigate("/MyActivities");
    } else {
      console.error("Advertiser Id is undefined");
      if (formData.image && AdvertiserId) {
        const file = await FileService.uploadFile(formData.image);
        const activityDataI = {
          name: formData.name,
          date: formData.date,
          time: formData.time,
          category: formData.category,
          location: { longitude: center.lng, latitude: center.lat },
          price: formData.price,
          tags: selectedTags.map((tag) => tag._id),
          special_discount: formData.special_discount,
          active_flag: formData.active_flag,
          advertiser_id: AdvertiserId,
          booking_flag: formData.booking,
          image: file.data._id,
        };
        await ActivityService.createActivity(activityDataI);
        showToastMessage("Activity created successfully", ToastTypes.SUCCESS);
        navigate("/MyActivities");
      } else {
        if (AdvertiserId) {
          await ActivityService.createActivity(activityData);
          showToastMessage("Activity created successfully", ToastTypes.SUCCESS);
          navigate("/MyActivities");
        } else {
          console.error("Advertiser Id is undefined");
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4 w-100">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Create Activity</h2>
        </Col>
      </Row>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <AdminFormGroup
                label="Name"
                type="text"
                placeholder="Enter Activity Name"
                id="activity-name"
                disabled={false}
                required={true}
                value={formData.name}
                onChange={handleChange}
                name="name"
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="category">
                <Form.Label>Category</Form.Label>
                <div className="custom-select-container">
                  <Form.Control
                    as="select"
                    name="category"
                    value={formData.category}
                    className="custom-form-control"
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category: Category) => (
                      <option key={category._id} value={category._id}>
                        {category.type}
                      </option>
                    ))}
                  </Form.Control>
                  <BiChevronDown className="dropdown-icon" />{" "}
                  {/* Dropdown icon */}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Date"
                type="date"
                placeholder="Enter activity date"
                id="activityDate"
                disabled={false}
                required={true}
                value={formData.date}
                onChange={handleChange}
                name="date"
              />
            </Col>
            <Col>
              <AdminFormGroup
                label="Time"
                type="time"
                placeholder="Enter activity time"
                id="activity-time"
                disabled={false}
                required={true}
                value={formData.time}
                onChange={handleChange}
                name="time"
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Price"
                type="number"
                placeholder="Enter your Price"
                id="activity-price"
                disabled={false}
                required={true}
                value={String(formData.price)}
                onChange={handleChange}
                name="price"
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="booking">
                <Form.Label>Booking</Form.Label>
                <div className="custom-select-container">
                  <Form.Control
                    placeholder="Select Booking"
                    as="select"
                    name="booking"
                    value={formData.booking ? "Open" : "Closed"}
                    className="custom-form-control"
                    onChange={handleChange}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </Form.Control>
                  <BiChevronDown className="dropdown-icon" />{" "}
                  {/* Dropdown icon */}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Special Discount"
                type="number"
                placeholder="Enter your Special Discount"
                id="special-discount"
                disabled={false}
                required={false}
                value={String(formData.special_discount)}
                onChange={handleChange}
                name="special_discount"
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="tags">
                <Form.Label>Tags</Form.Label>
                <div className="tags-input">
                  {selectedTags.map((tag) => (
                    <span key={tag._id} className="tag">
                      {tag.type}{" "}
                      <button
                        type="button"
                        className="remove-tag"
                        onClick={() => handleDeleteTag(tag._id)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleAddTag}
                    placeholder="Add a tag (e.g., #historical)"
                  />
                </div>
                {suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>
                  <h3>Upload Image Activity</h3>
                </Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="custom-form-control"
                  accept="image/*"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Button
              variant="main-inverse"
              className="mt-2 m-auto w-25"
              onClick={handleAddLocation}
            >
              Add Location
            </Button>
            {/* Modal for Location */}
            <MapModal
              open={showMapModal}
              handleClose={handleCloseMapModal}
              center={center}
              onMapClick={ 
                (e) => {
                  if (e.detail.latLng) {
                    setCenter({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
                  }
                }
              } />
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="is-active">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  name="active_flag"
                  checked={formData.active_flag}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <div className="form-actions">
              <Button type="submit" variant="main-inverse">
                Create Activity
              </Button>
            </div>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default AdvertiserCreate;
