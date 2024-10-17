import React, { ChangeEvent, useEffect, useState } from "react";
import AdminFormGroup from "../../components/FormGroup/FormGroup"; // Adjust the path as necessary
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { BiChevronDown } from "react-icons/bi"; // Importing a dropdown icon from react-icons
import "../tagsinput.css";
import CategoryService from "../../services/CategoryService";
import { useNavigate, useParams } from "react-router-dom";
import { ActivityService } from "../../services/ActivityService";
import { AdminService } from "../../services/AdminService";

interface FormData {
  name: string;
  suggestions: string;
  date: string;
  time: string;
  price: number;
  active_flag: boolean;
  category: string;
  special_discount: number;
  booking: boolean;
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
  const { activity_id } = useParams();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    suggestions: "",
    date: "",
    time: "",
    price: 0,
    active_flag: false,
    category: "",
    special_discount: 0,
    booking: false,
  });
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "booking") {
      if (value === "Open") {
        setFormData({
          ...formData,
          [name]: true,
        });
      } else {
        setFormData({
          ...formData,
          [name]: false,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      const tag = inputValue.trim();
      if (tag && !tags.some(t => t.type === tag)) {
        alert("Invalid tag");
        setInputValue("");
        return;
      }
      const foundTag = tags.find(t => t.type === tag);
      if (foundTag && !selectedTags.some(t => t._id === foundTag._id)) {
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
    const foundTag = tags.find(t => t.type === suggestion);
    if (foundTag && !selectedTags.some(t => t._id === foundTag._id)) {
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
      const filteredSuggestions = filteredTags.filter((tag) => !selectedTagIds.has(tag._id));
      setSuggestions(filteredSuggestions.map((tag) => tag.type));
    } else {
      setSuggestions([]);
    }
  }, [inputValue, tags]);

  const getTags = async (page: number) => {
    const tagsData = await AdminService.getTags(page); // Assuming page 1 as the default
    setTags(tagsData.data);
  }

  const getActivity = async () => {
    try {
      if (activity_id) {
        const response = await ActivityService.getActivityById(activity_id);
        const activity = response.data;
        setFormData({
          name: activity.name,
          date: activity.date.toString().split("T")[0],
          time: activity.time,
          price: activity.price,
          active_flag: activity.active_flag,
          category: activity.category._id,
          special_discount: activity.special_discount,
          booking: activity.booking_flag,
          suggestions: "",
        });
        setSelectedTags(activity.tags);
      } else {
        console.error("Activity ID is undefined");
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await CategoryService.getCategoryById(1); // Replace with appropriate API call
      const categoryData = response.data.map((category: any) => {
        return {
          _id: category._id,
          type: category.type,
        };
      })
      setCategories(categoryData); // Assuming the response has 'data' containing the categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getActivity();
    getTags(1);
    getAllCategories();
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      date: formData.date,
      time: formData.time,
      location: { longitude: 100, latitude: 100 },
      price: formData.price,
      tags: selectedTags.map((tag) => tag._id),
      category: formData.category,
      active_flag: formData.active_flag,
      booking_flag: formData.booking,
    };
    if (activity_id) {
      await ActivityService.updateActivity(activity_id, productData);
      navigate("/MyActivities");
    } else {
      console.error("Advertiser Id is undefined");
    }
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Edit Activity</h2>
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
                id="name"
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
                    className="custom-form-control"
                    value={formData.category}
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
                id="date"
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
                id="time"
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
                id="price"
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
                id="special_discount"
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
            <div className="card w-50 p-3 mt-3 border-1 m-2 m-auto p-md-2 loc">
              <div className="card-body">
                <h5 className="card-title">Location</h5>
              </div>
              <div className="ratio ratio-1x1">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.7252495085836!2d31.435660077332482!3d29.98732507495249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583cb2bfafbe73%3A0x6e7220116094726d!2sGerman%20University%20in%20Cairo%20(GUC)!5e0!3m2!1sen!2seg!4v1728233137915!5m2!1sen!2seg"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <Button variant="main-inverse" className="mt-2 m-auto">Add Location</Button>
            </div>
          </Row>
          <Row>
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
          </Row>
          <Row>
            <div className="form-actions">
              <Button type="submit" variant="main-inverse">
                Update
              </Button>
            </div>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default AdvertiserCreate;
