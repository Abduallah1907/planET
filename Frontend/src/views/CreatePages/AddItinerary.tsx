import React, { useState, ChangeEvent, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../../components/FormGroup/FormGroup"; // Reuse the form group component
import "../tagsinput.css";
import { BiChevronDown } from "react-icons/bi";

interface Tag {
  _id: string;
  type: string;
}

const ItineraryForm: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [timelineActivities, setTimelineActivities] = useState<string[]>([""]);
  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [locations, setLocations] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<
    { date: string; time: string }[]
  >([]);
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [tourGuideId, setTourGuideId] = useState<string>("");
  const [isAccessible, setIsAccessible] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [newAvailableDate, setNewAvailableDate] = useState<string>("");
  const [newAvailableTime, setNewAvailableTime] = useState<string>("");

  const [tags, setTags] = useState<Tag[]>([]);

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
      setAvailableDates((prev) => [
        ...prev,
        { date: newAvailableDate, time: newAvailableTime },
      ]);
      setNewAvailableDate("");
      setNewAvailableTime("");
    }
  };

  const handleDeleteAvailableDate = (index: number) => {
    setAvailableDates((prev) => prev.filter((_, i) => i !== index));
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
  }, [inputValue]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Add Itinerary</h2>
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
                  className="custom-form-control"
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
              <AdminFormGroup
                className="form-group"
                label="Name"
                type="text"
                placeholder="Enter Itinerary Name"
                id="itinerary-name"
                required={true}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={false}
                name={""}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="form-group" controlId="timelineActivities">
                <Form.Label>Timeline Activities</Form.Label>
                {timelineActivities.map((activity, index) => (
                  <div key={index} className="timeline-activity">
                    <Form.Control
                      type="text"
                      className="mt-1 custom-form-control"
                      placeholder="Enter Activity"
                      value={activity}
                      onChange={(e) =>
                        handleActivityChange(index, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}
                <Button
                  variant="main-inverse"
                  className="mt-3"
                  onClick={handleAddActivity}
                >
                  Add Another Activity
                </Button>
              </Form.Group>
            </Col>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Locations"
                type="text"
                placeholder="Enter Locations to be visited"
                id="locations"
                required={true}
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                disabled={false}
                name={""}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Duration"
                type="text"
                placeholder="Enter Duration (e.g., 3 hours)"
                id="duration"
                required={true}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={false}
                name={""}
              />
            </Col>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Language of Tour"
                type="text"
                placeholder="Enter Language"
                id="language"
                required={true}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={false}
                name={""}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Price"
                type="number"
                placeholder="Enter Price"
                id="price"
                required={true}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={false}
                name={""}
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="availableDates">
                <Form.Label>Available Dates & Times</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      className="form-group custom-form-control"
                      type="date"
                      value={newAvailableDate}
                      onChange={(e) => setNewAvailableDate(e.target.value)}
                      placeholder="Select Date"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      className="form-group custom-form-control"
                      type="time"
                      value={newAvailableTime}
                      onChange={(e) => setNewAvailableTime(e.target.value)}
                      placeholder="Select Time"
                    />
                  </Col>
                  <Col>
                    <Button
                    variant="main-inverse"
                      onClick={handleAddAvailableDate}
                    >
                      Add
                    </Button>
                  </Col>
                </Row>
                {availableDates.map((available, index) => (
                  <Container className="form-group">
                    <div key={index} className="available-date-time">
                      {available.date} at {available.time}{" "}
                      <Button
                        type="button"
                        onClick={() => handleDeleteAvailableDate(index)}
                        variant="main-inverse"
                      >
                        &times;
                      </Button>
                    </div>
                  </Container>
                ))}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Pickup Location"
                type="text"
                placeholder="Enter Pickup Location"
                id="pickup-location"
                required={true}
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                disabled={false}
                name={""}
              />
            </Col>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Drop-off Location"
                type="text"
                placeholder="Enter Drop-off Location"
                id="dropoff-location"
                required={true}
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                disabled={false}
                name={""}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Tour Guide ID"
                type="text"
                placeholder="Enter Tour Guide ID"
                id="tour-guide-id"
                required={true}
                value={tourGuideId}
                onChange={(e) => setTourGuideId(e.target.value)}
                disabled={false}
                name={""}
              />
            </Col>
          </Row>

          <Row>
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
              <Form.Group className="form-group" controlId="isAccessible">
                <Form.Check
                  type="checkbox"
                  label="Accessibility"
                  checked={isAccessible}
                  onChange={(e) => setIsAccessible(e.target.checked)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="main-inverse" className="mt-3 mb-5" type="submit">
            Submit Itinerary
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ItineraryForm;
