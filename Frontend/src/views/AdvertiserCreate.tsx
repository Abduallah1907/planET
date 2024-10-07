import React, { ChangeEvent, useEffect, useState } from "react";
import "./CreateAdmin/CreateAdmin.css";
import AdminFormGroup from "../components/FormGroup/FormGroup"; // Adjust the path as necessary
import Logo from "../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { BiChevronDown } from "react-icons/bi"; // Importing a dropdown icon from react-icons
import tagsData from "./tags.json"; // Ensure this path is correct
import "../components/FormGroup.css";
import "./tagsinput.css";

const AdvertiserCreate: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [activityName, setActivityName] = useState<string>("");
  const [activityDate, setActivityDate] = useState<string>("");
  const [activityTime, setActivityTime] = useState<string>("");
  const [activityPrice, setActivityPrice] = useState<string>("");
  const [specialDiscount, setSpecialDiscount] = useState<string>("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      const tag = inputValue.trim();
      if (tag && !tagsData.includes(tag)) {
        alert("Invalid tag");
        setInputValue("");
        return;
      }
      if (tag && !selectedTags.includes(tag)) {
        setSelectedTags((prev) => [...prev, tag]);
        setInputValue("");
      }
    }
  };

  const onSuggestionClick = (suggestion: string) => {
    if (suggestion && !selectedTags.includes(suggestion)) {
      setSelectedTags((prev) => [...prev, suggestion]);
      setInputValue("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToDelete));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleActivityNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActivityName(e.target.value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActivityDate(e.target.value);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActivityTime(e.target.value);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActivityPrice(e.target.value);
  };

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSpecialDiscount(e.target.value);
  };

  useEffect(() => {
    // Filter tags based on input value
    if (inputValue.startsWith("#")) {
      const filteredSuggestions = tagsData.filter((tag: string) =>
        tag.toLowerCase().includes(inputValue.slice(1).toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Create Activity</h2>
        </Col>
      </Row>

      <Container>
        <Form>
          <Row>
            <Col>
              <AdminFormGroup
                label="Name"
                type="text"
                placeholder="Enter Activity Name"
                id="activity-name"
                disabled={false}
                required={true}
                value={activityName}
                onChange={handleActivityNameChange}
                name="activityName"
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="category">
                <Form.Label>Category</Form.Label>
                <div className="custom-select-container">
                  <Form.Control as="select" name="Category">
                    <option value="">Select Category</option>
                    <option value="Category2">Category2</option>
                    <option value="Category3">Category3</option>
                    <option value="Category4">Category4</option>
                  </Form.Control>
                  <BiChevronDown className="dropdown-icon" /> {/* Dropdown icon */}
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
                value={activityDate}
                onChange={handleDateChange}
                name="activityDate"
              />
            </Col>
            <Col>
              <AdminFormGroup
                label="Time"
                type="text"
                placeholder="Enter activity time"
                id="activity-time"
                disabled={false}
                required={true}
                value={activityTime}
                onChange={handleTimeChange}
                name="activityTime"
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
                value={activityPrice}
                onChange={handlePriceChange}
                name="activityPrice"
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="booking">
                <Form.Label>Booking</Form.Label>
                <div className="custom-select-container">
                  <Form.Control placeholder="Select Booking" as="select" name="Booking">
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </Form.Control>
                  <BiChevronDown className="dropdown-icon" /> {/* Dropdown icon */}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Special Discount"
                type="text"
                placeholder="Enter your Special Discount"
                id="special-discount"
                disabled={false}
                required={false}
                value={specialDiscount}
                onChange={handleDiscountChange}
                name="specialDiscount"
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="tags">
                <Form.Label>Tags</Form.Label>
                <div className="custom-select-container">
                  <div className="tags-input ">
                    {selectedTags.map((tag) => (
                      <span key={tag} className="tag ps-2">
                        {tag}{" "}
                        <button
                          type="button"
                          className="remove-tag"
                          onClick={() => handleDeleteTag(tag)}
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
                      placeholder="Add a tag (e.g., #tag)"
                    />
                  </div>
                  {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion}
                          onClick={() => onSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
              <Button className="update-btn mt-2 m-auto">Add Location</Button>
            </div>

            <div className="form-actions">
              <Button type="submit" className="update-btn">
                Submit
              </Button>
            </div>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default AdvertiserCreate;