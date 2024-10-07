import React, { useState, ChangeEvent, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../components/FormGroup/FormGroup"; // Reuse the form group component
import "../components/FormGroup.css"; // Reuse existing CSS
import "./CreateAdmin/CreateAdmin.css"; // Reuse the existing CSS
import "./tagsinput.css";
import tagsData from "./tags.json"; // Ensure this path is correct
import { BiChevronDown } from "react-icons/bi";

const ItineraryForm: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [timelineActivities, setTimelineActivities] = useState<string[]>([""]);
  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [locations, setLocations] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<{ date: string; time: string }[]>([]);
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [tourGuideId, setTourGuideId] = useState<string>("");
  const [isAccessible, setIsAccessible] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  
  const [newAvailableDate, setNewAvailableDate] = useState<string>("");
  const [newAvailableTime, setNewAvailableTime] = useState<string>("");

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

  const handleDeleteTag = (tagToDelete: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToDelete));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleActivityChange = (index: number, value: string) => {
    const newActivities = [...timelineActivities];
    newActivities[index] = value;
    setTimelineActivities(newActivities);
  };

  const handleAddActivity = () => {
    setTimelineActivities((prev) => [...prev, ""]);
  };

  const handleAddAvailableDate = () => {
    if (newAvailableDate && newAvailableTime) {
      setAvailableDates((prev) => [...prev, { date: newAvailableDate, time: newAvailableTime }]);
      setNewAvailableDate("");
      setNewAvailableTime("");
    }
  };

  const handleDeleteAvailableDate = (index: number) => {
    setAvailableDates((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (inputValue.startsWith("#")) {
      const filteredSuggestions = tagsData.filter((tag: string) =>
        tag.toLowerCase().includes(inputValue.slice(1).toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add form submission logic here
    console.log({
      timelineActivities,
      category,
      name,
      locations,
      duration,
      language,
      price,
      availableDates,
      pickupLocation,
      dropoffLocation,
      tourGuideId,
      selectedTags,
      isAccessible,
      isActive,
    });
  };

  return (
    <div className="profile-form-container">
        <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Edit Itinerary</h2>
        </Col>
      </Row>
      <Container>
        <Form onSubmit={handleFormSubmit}>
          <Row>
            <Col>
              <Form.Group className="form-group" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Historical">Historical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Relaxation">Relaxation</option>
                </Form.Control>
                <BiChevronDown className="dropdown-icon" />
              </Form.Group>
            </Col>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Name"
                              type="text"
                              placeholder="Enter Itinerary Name"
                              id="itinerary-name"
                              required={true}
                              value={name}
                              onChange={(e) => setName(e.target.value)} disabled={false} name={""}              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group  className="form-group" controlId="timelineActivities">
                <Form.Label>Timeline Activities</Form.Label>
                {timelineActivities.map((activity, index) => (
                  <div key={index} className="timeline-activity">
                    <Form.Control
                      type="text"
                      className="mt-1"
                      placeholder="Enter Activity"
                      value={activity}
                      onChange={(e) => handleActivityChange(index, e.target.value)}
                      required
                    />
                  </div>
                ))}
                <Button className="update-btn mt-3" variant="outline-primary" onClick={handleAddActivity}>
                  Add Another Activity
                </Button>
              </Form.Group>
            </Col>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Locations"
                              type="text"
                              placeholder="Enter Locations to be visited"
                              id="locations"
                              required={true}
                              value={locations}
                              onChange={(e) => setLocations(e.target.value)} disabled={false} name={""}              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Duration"
                              type="text"
                              placeholder="Enter Duration (e.g., 3 hours)"
                              id="duration"
                              required={true}
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)} disabled={false} name={""}              />
            </Col>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Language of Tour"
                              type="text"
                              placeholder="Enter Language"
                              id="language"
                              required={true}
                              value={language}
                              onChange={(e) => setLanguage(e.target.value)} disabled={false} name={""}              />
            </Col>
          </Row>

          <Row>
            <Col> 
              <AdminFormGroup className="form-group"
                              label="Price"
                              type="number"
                              placeholder="Enter Price"
                              id="price"
                              required={true}
                              value={price}
                              onChange={(e) => setPrice(e.target.value)} disabled={false} name={""}              />
            </Col>
            <Col>
              <Form.Group  className="form-group" controlId="availableDates">
                <Form.Label>Available Dates & Times</Form.Label>
                <Row>
                  <Col>
                    <Form.Control className="form-group"
                      type="date"
                      value={newAvailableDate}
                      onChange={(e) => setNewAvailableDate(e.target.value)}
                      placeholder="Select Date"
                    />
                  </Col>
                  <Col>
                    <Form.Control className="form-group"
                      type="time"
                      value={newAvailableTime}
                      onChange={(e) => setNewAvailableTime(e.target.value)}
                      placeholder="Select Time"
                    />
                  </Col>
                  <Col>
                    <Button variant="outline-primary" className="update-btn " onClick={handleAddAvailableDate}>
                      Add
                    </Button>
                  </Col>
                </Row>
                {availableDates.map((available, index) => (
                    <Container className="form-group">
                  <div key={index} className="available-date-time">
                    {available.date} at {available.time}{" "}
                    <button 
                      type="button"
                      onClick={() => handleDeleteAvailableDate(index)}
                      className="update-btn "
                    >
                      &times;
                    </button>
                  </div>
                  </Container>
                ))}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Pickup Location"
                              type="text"
                              placeholder="Enter Pickup Location"
                              id="pickup-location"
                              required={true}
                              value={pickupLocation}
                              onChange={(e) => setPickupLocation(e.target.value)} disabled={false} name={""}              />
            </Col>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Drop-off Location"
                              type="text"
                              placeholder="Enter Drop-off Location"
                              id="dropoff-location"
                              required={true}
                              value={dropoffLocation}
                              onChange={(e) => setDropoffLocation(e.target.value)} disabled={false} name={""}              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Tour Guide ID"
                              type="text"
                              placeholder="Enter Tour Guide ID"
                              id="tour-guide-id"
                              required={true}
                              value={tourGuideId}
                              onChange={(e) => setTourGuideId(e.target.value)} disabled={false} name={""}              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group  className="form-group" controlId="tags">
                <Form.Label>Tags</Form.Label>
                <div className="tags-input">
                  {selectedTags.map((tag) => (
                    <span key={tag} className="tag">
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
                    placeholder="Add a tag (e.g., #historical)"
                  />
                </div>
                {suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        onClick={() => setSelectedTags((prev) => [...prev, suggestion])}
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
              <Form.Group  className="form-group" controlId="isAccessible">
                <Form.Check
                  type="checkbox"
                  label="Accessibility"
                  checked={isAccessible}
                  onChange={(e) => setIsAccessible(e.target.checked)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group  className="form-group"controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button className="update-btn mt-3 mb-5" type="submit">
            Update Itinerary
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ItineraryForm;
