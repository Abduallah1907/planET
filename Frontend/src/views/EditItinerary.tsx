import React, { useState, ChangeEvent, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../components/FormGroup/FormGroup"; // Reuse the form group component
import "../components/FormGroup.css"; // Reuse existing CSS
import "./CreateAdmin/CreateAdmin.css"; // Reuse the existing CSS
import "./tagsinput.css";
import { BiChevronDown } from "react-icons/bi";
import { ItineraryService } from "../services/ItineraryService";
import CategoryService from "../services/CategoryService";
import { AdminService } from "../services/AdminService";
import { ActivityService } from "../services/ActivityService";
import languages from "../utils/languageOptions.json";
import { useParams } from "react-router-dom";


interface FormData {
  name?: string;
  category?: string;
  activities?: string[];
  timeline?: string[];
  locations?: Location[];
  duration?: string;
  languages?: string[];
  price?: number;
  available_dates?: Date[];
  accessibility?: boolean;
  pickup_loc?: Location;
  drop_off_loc?: Location;
  tags?: string[];
  active_flag?: boolean;
}

interface Tag {
  _id: string;
  type: string;
}
interface Category {
  _id: string;
  type: string;
}
interface Activity {
  _id: string;
  name: string;
}

const ItineraryForm: React.FC = () => {
  const { itinerary_id } = useParams();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [formData, setFormData] = useState<FormData>({});
  const [filteredLanguages, setFilteredLanguages] = useState<{ label: string; value: string }[]>(languages);

  const [timelineActivities, setTimelineActivities] = useState<Activity[]>([]);
  const [locations, setLocations] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<{ date: string; time: string }[]>([]);

  const [newAvailableDate, setNewAvailableDate] = useState<string>("");
  const [newAvailableTime, setNewAvailableTime] = useState<string>("");

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleActivityChange = (index: number, value: string) => {
    const newActivities = [...timelineActivities];
    const activity = activities.find(activity => activity.name === value);
    if (activity) {
      newActivities[index] = activity;
      setTimelineActivities(newActivities);
    }
  };

  const handleAddActivity = () => {
    setTimelineActivities((prev) => [...prev, { _id: "", name: "" }]);
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
      console.log(tags);
      const filteredTags = tags.filter((tag: Tag) =>
        tag.type.toLowerCase().includes(inputValue.slice(1).toLowerCase())
      );
      setSuggestions(filteredTags.map((tag) => tag.type));
    } else {
      setSuggestions([]);
    }
  }, [inputValue, tags]);

  const getTags = async (page: number) => {
    const tagsData = await AdminService.getTags(page); // Assuming page 1 as the default
    setTags(tagsData.data);
  }

  const getItineraryById = async () => {
    if (itinerary_id) {
      const itinerary = await ItineraryService.getItineraryById(itinerary_id);
      setFormData(itinerary.data);
      setFilteredLanguages(itinerary.data.languages.map((language: string) => ({ label: language, value: language })));
    }
  }

  useEffect(() => {
    getAllCategories();
    getTags(1);
    getAllActivities();
    getItineraryById();
  }, []);


  const getAllCategories = async () => {
    const categories = await CategoryService.getAll();
    setCategories(categories.data);
  };

  const getAllActivities = async () => {
    const activities = await ActivityService.getAllActivities();
    setActivities(activities.data);
    setTimelineActivities(activities.data.map((activity: Activity) => activity.name));
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
                <div className="custom-select-container">
                  <Form.Control
                    as="select"
                    name="category"
                    className="custom-form-control"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.type} value={category._id}>
                        {category.type}
                      </option>
                    ))}
                  </Form.Control>
                  <BiChevronDown className="dropdown-icon" />
                </div>
              </Form.Group>
            </Col>
            <Col>
              <AdminFormGroup className="form-group"
                label="Name"
                type="text"
                placeholder="Enter Itinerary Name"
                id="name"
                required={true}
                value={formData.name}
                onChange={handleChange}
                disabled={false}
                name={"name"} />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="form-group" controlId="timelineActivities">
                <Form.Label>Timeline Activities</Form.Label>
                {timelineActivities.map((activity, index) => (
                  <div key={index} className="timeline-activity custom-select-container">
                    <Form.Control
                      as="select"
                      onChange={(e) => handleActivityChange(index, e.target.value)}
                      className="mt-1 custom-form-control"
                      value={activity.name}
                      required>
                      {activities.map((activity) => (
                        <option key={activity.name} value={activity._id}>
                          {activity.name}
                        </option>
                      ))}
                    </Form.Control>
                    <BiChevronDown className="dropdown-icon" /> {/* Dropdown icon */}
                  </div>
                ))}
                <Button
                  className="update-btn mt-3"
                  variant="outline-primary"
                  onClick={handleAddActivity}
                >
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
                onChange={(e) => setLocations(e.target.value)} disabled={false} name={""} />
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
                value={formData.duration}
                onChange={handleChange}
                disabled={false}
                name={"duration"} />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="timelineActivities">
                <Form.Label>Languages</Form.Label>
                {filteredLanguages.map((filteredLanguage, index) => (
                  <div key={index} className="timeline-activity custom-select-container">
                    <Form.Control
                      as="select"
                      // onChange={(e) => handleLanguageChange(index, e.target.value)}
                      className="mt-1 custom-form-control"
                      value={filteredLanguage.value}
                      required>
                      {languages.map((language) => (
                        <option key={language.value} value={language.value}>
                          {language.label}
                        </option>
                      ))}
                    </Form.Control>
                    <BiChevronDown className="dropdown-icon" /> {/* Dropdown icon */}
                  </div>
                ))}
                <Button className="update-btn mt-3" variant="outline-primary" onClick={handleAddActivity}>
                  Add Another Language
                </Button>
              </Form.Group>
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
                value={formData.price?.toString()}
                onChange={handleChange}
                disabled={false}
                name={""} />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="availableDates">
                <Form.Label>Available Dates & Times</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      className="form-group"
                      type="date"
                      value={newAvailableDate}
                      onChange={(e) => setNewAvailableDate(e.target.value)}
                      placeholder="Select Date"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      className="form-group"
                      type="time"
                      value={newAvailableTime}
                      onChange={(e) => setNewAvailableTime(e.target.value)}
                      placeholder="Select Time"
                    />
                  </Col>
                  <Col>
                    <Button
                      variant="outline-primary"
                      className="update-btn "
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
                id="pickup_loc"
                required={true}
                value={formData.pickup_loc ? formData.pickup_loc.toString() : ""}
                onChange={handleChange}
                disabled={false}
                name={"pickup_loc"} />
            </Col>
            <Col>
              <AdminFormGroup className="form-group"
                label="Drop-off Location"
                type="text"
                placeholder="Enter Drop-off Location"
                id="dropoff-location"
                required={true}
                value={formData.drop_off_loc ? formData.drop_off_loc.toString() : ""}
                onChange={handleChange}
                disabled={false}
                name={"drop_off_loc"} />
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
                        onClick={() => {
                          const foundTag = tags.find(t => t.type === suggestion);
                          if (foundTag && !selectedTags.some(t => t._id === foundTag._id)) {
                            setSelectedTags((prev) => [...prev, foundTag]);
                          }
                        }}
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
                  checked={formData.accessibility}
                  name="accessibility"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={formData.active_flag}
                  name="active_flag"
                  onChange={handleChange}
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