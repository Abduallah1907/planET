import React, { useState, ChangeEvent, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../../components/FormGroup/FormGroup"; // Reuse the form group component
import "../CreateAdmin/CreateAdmin.css"; // Reuse the existing CSS
import "../tagsinput.css";
import { BiChevronDown } from "react-icons/bi";
import { ItineraryService } from "../../services/ItineraryService";
import CategoryService from "../../services/CategoryService";
import { AdminService } from "../../services/AdminService";
import { ActivityService } from "../../services/ActivityService";
import languages from "../../utils/languageOptions.json";
import { useNavigate, useParams } from "react-router-dom";
import SlotsModal from "../../components/SlotsModals"; // Import SlotModal component
import showToastMessage from "../../utils/showToastMessage";
import { ToastTypes } from "../../utils/toastTypes";
import { set } from "date-fns";

interface FormData {
  name?: string;
  category?: string;
  choosen?: string[];
  locations?: Location[];
  duration?: string;
  languages?: string[];
  price?: number;
  accessibility?: boolean;
  pickup_loc?: Location;
  drop_off_loc?: Location;
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

interface Slot {
  title: string;
  description: string;
  from: string;
  to: string;
  index?: number; // Add the index property
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
  const [filteredLanguages, setFilteredLanguages] = useState<
    { label: string; value: string }[]
  >([]);

  const [choosenActivities, setChoosenActivities] = useState<Activity[]>([]);
  const [locations, setLocations] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<
    { date: string; time: string }[]
  >([]);

  const [newAvailableDate, setNewAvailableDate] = useState<string>("");
  const [newAvailableTime, setNewAvailableTime] = useState<string>("");

  const [slots, setSlots] = useState<Slot[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<Slot>();

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
  const [isClicked, setIsClicked] = useState(false);

  const handleDeleteTag = (tagToDeleteID: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag._id !== tagToDeleteID));
  };

  const handleSuggestionClick = (suggestion: string) => {
    const foundTag = tags.find((t) => t.type === suggestion);
    if (foundTag && !selectedTags.some((t) => t._id === foundTag._id)) {
      setSelectedTags((prev) => [...prev, foundTag]);
      setSuggestions((prev) => prev.filter((s) => s !== suggestion));
      setInputValue("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleActiveChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(!e.target.checked)
    showToastMessage( "itinerary cannot be deactivated unless there are no bookings so this may fail",ToastTypes.WARNING);
    setFormData({ ...formData, active_flag: e.target.checked });
  };

  const handleActivityChange = (index: number, value: string) => {
    const newActivities = [...choosenActivities];
    const activity = activities.find((activity) => activity._id === value);
    if (activity) {
      newActivities[index] = activity;
      setChoosenActivities(newActivities);
    }
  };

  const handleAddActivity = () => {
    setChoosenActivities((prev) => [...prev, { _id: "", name: "" }]);
    setIsClicked(true);
  };

  const handleDeleteActivity = (index: number) => {
    setChoosenActivities((prevActivities) =>
      prevActivities.filter((_, i) => i !== index)
    );
  };

  const handleLanguageChange = (index: number, value: string) => {
    const newLanguages = [...filteredLanguages];
    const language = languages.find((language) => language.value === value);
    if (language) {
      newLanguages[index] = language;
      setFilteredLanguages(newLanguages);
    }
  };

  const handleAddLanguage = () => {
    setFilteredLanguages((prev) => [...prev, { label: "", value: "" }]);
    setIsClicked(true);
  };

  const handleDeleteLanguage = (index: number) => {
    setFilteredLanguages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSlot = () => {
    setCurrentSlot({
      title: "",
      description: "",
      from: "",
      to: "",
      index: slots.length,
    });
    setShowModal(true);
    setIsClicked(true);
  };

  const handleEditSlot = (index: number) => {
    setCurrentSlot(slots[index]);
    setShowModal(true);
  };

  const handleSaveSlot = (slot: Slot) => {
    if (currentSlot?.index !== undefined) {
      const updatedSlots = [...slots];
      updatedSlots[currentSlot.index] = slot;
      setSlots(updatedSlots);
    } else {
      setSlots([...slots, slot]);
    }
  };

  const handleDeleteSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleCloseModal = () => setShowModal(false);

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
      const filteredSuggestions = filteredTags.filter(
        (tag) => !selectedTagIds.has(tag._id)
      );
      setSuggestions(filteredSuggestions.map((tag) => tag.type));
    } else {
      setSuggestions([]);
    }
  }, [inputValue, tags]);

  const getTags = async (page: number) => {
    const tagsData = await AdminService.getTags(page); // Assuming page 1 as the default
    setTags(tagsData.data);
  };

  const getItineraryById = async () => {
    if (itinerary_id) {
      const itinerary = await ItineraryService.getItineraryById(itinerary_id);
      setFormData({
        name: itinerary.data.name,
        category: itinerary.data.category._id,
        duration: itinerary.data.duration,
        price: itinerary.data.price,
        accessibility: itinerary.data.accessibility,
        active_flag: itinerary.data.active_flag,
        pickup_loc: itinerary.data.pickup_loc,
        drop_off_loc: itinerary.data.drop_off_loc,
      });
      setChoosenActivities(
        itinerary.data.activities.map((activity: Activity) => ({
          _id: activity._id,
          name: activity.name,
        }))
      );
      setSelectedTags(itinerary.data.tags);
      setFilteredLanguages(
        itinerary.data.languages.map((language: string) => ({
          label: language,
          value: language,
        }))
      );
    }
  };

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
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const itineraryData = {
      ...formData,
      activities: choosenActivities.map((activity) => activity._id),
      tags: selectedTags.map((tag) => tag._id),
      languages: filteredLanguages.map((language) => language.value),
      available_dates: availableDates.map(
        (date) => new Date(`${date.date}T${date.time}`)
      ),
      slots: slots,
    };
    if (itinerary_id) {
      await ItineraryService.updateItinerary(itinerary_id, itineraryData);
      navigate("/MyItineraries");
    } else {
      console.error("Itinerary ID is undefined");
    }
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Edit Itinerary</h2>
        </Col>
      </Row>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Name"
                type="text"
                placeholder="Enter Itinerary Name"
                id="name"
                required={true}
                value={formData.name}
                onChange={handleChange}
                disabled={false}
                name={"name"}
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
                    required
                  >
                    <option value="">Select Category</option>
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
          </Row>

          <Row>
            <Col>
              <Form.Group className="form-group" controlId="choosenActivities">
                <Form.Label>Activities</Form.Label>
                {choosenActivities.map((activity, index) => (
                  <Row className="align-items-center">
                    <Col
                      key={index}
                      className="choosen-activity custom-select-container pe-0"
                    >
                      <Form.Control
                        as="select"
                        onChange={(e) =>
                          handleActivityChange(index, e.target.value)
                        }
                        className="mt-1 custom-form-control"
                        value={activity._id}
                        required
                      >
                        <option value="">Select Activity</option>
                        {activities.map((activity) => (
                          <option key={activity.name} value={activity._id}>
                            {activity.name}
                          </option>
                        ))}
                      </Form.Control>
                      <BiChevronDown className="dropdown-icon" />{" "}
                      {/* Dropdown icon */}
                    </Col>
                    <Col md="auto">
                      <Button
                        variant="danger"
                        className="ml-2 mt-1"
                        onClick={() => handleDeleteActivity(index)}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button
                  className={`ms-2 ${isClicked ? "mt-1" : ""}`}
                  variant="main-inverse"
                  onClick={handleAddActivity}
                >
                  Add Another Activity
                </Button>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="slots">
                <Form.Label>Slots</Form.Label>
                <div>
                  {slots.map((slot, index) => (
                    <Row>
                      <Col className="pe-0">
                        <Form.Control
                          className="mt-1 custom-form-control"
                          type="text"
                          value={`${slot.title} (${slot.from} - ${slot.to})`}
                          readOnly
                          onClick={() => handleEditSlot(index)}
                        />
                      </Col>
                      <Col md="auto">
                        <Button
                          variant="danger"
                          className="ml-2 mt-1"
                          onClick={() => handleDeleteSlot(index)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    className={`position-relative ${isClicked ? "ms-2" : "ms-5"}`}
                    style={{ top: isClicked ? '-12px' : '-45px', marginTop: isClicked ? '1rem' : '0' }}
                    variant="main-inverse"
                    onClick={handleAddSlot}
                  >
                    Add Slot
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
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
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Duration"
                type="text"
                placeholder="Enter Duration (e.g., 3 hours)"
                id="duration"
                required={true}
                value={formData.duration}
                onChange={handleChange}
                disabled={false}
                name={"duration"}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="form-group" controlId="choosenActivities">
                <Form.Label>Languages</Form.Label>
                {filteredLanguages.map((filteredLanguage, index) => (
                  <Row className="align-items-center">
                    <Col
                      key={index}
                      className="choosen-activity custom-select-container pe-0"
                    >
                      <Form.Control
                        as="select"
                        // onChange={(e) => handleLanguageChange(index, e.target.value)}
                        className="mt-1 custom-form-control"
                        value={filteredLanguage.value}
                        onChange={(e) =>
                          handleLanguageChange(index, e.target.value)
                        }
                        required
                      >
                        <option value="">Select Language</option>
                        {languages.map((language) => (
                          <option key={language.value} value={language.value}>
                            {language.label}
                          </option>
                        ))}
                      </Form.Control>
                      <BiChevronDown className="dropdown-icon" />{" "}
                      {/* Dropdown icon */}
                    </Col>
                    <Col md="auto">
                      <Button
                        variant="danger"
                        className="ml-2 mt-1"
                        onClick={() => handleDeleteLanguage(index)}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button
                  className={`ms-2 ${isClicked ? "mt-1" : ""}`}
                  variant="main-inverse" 
                  onClick={handleAddLanguage}
                >
                  Add Another Language
                </Button>
              </Form.Group>
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
                      className="mt-1"
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
                        variant="danger"
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
                id="pickup_loc"
                required={true}
                value={
                  formData.pickup_loc ? formData.pickup_loc.toString() : ""
                }
                onChange={handleChange}
                disabled={false}
                name={"pickup_loc"}
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
                value={
                  formData.drop_off_loc ? formData.drop_off_loc.toString() : ""
                }
                onChange={handleChange}
                disabled={false}
                name={"drop_off_loc"}
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
                value={String(formData.price)}
                onChange={handleChange}
                disabled={false}
                name={"price"}
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
                  onChange={handleActiveChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="main-inverse" className="mt-3 mb-5" type="submit">
            Update Itinerary
          </Button>
        </Form>
      </Container>

      <SlotsModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSave={handleSaveSlot}
        slot={
          currentSlot || {
            title: "",
            description: "",
            from: "",
            to: "",
            index: -1,
          }
        }
        setSlot={setCurrentSlot}
      />
    </div>
  );
};

export default ItineraryForm;
