import React, { useState, ChangeEvent, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../components/FormGroup/FormGroup"; // Reuse the form group component
import "../components/FormGroup.css"; // Reuse existing CSS
import "./CreateAdmin/CreateAdmin.css"; // Reuse the existing CSS
import "./tagsinput.css";
import tagsData from "./tags.json"; // Ensure this path is correct
import { BiChevronDown } from "react-icons/bi";

const HistoricalPlaceForm: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [picture, setPicture] = useState<File | null>(null);
  const [location, setLocation] = useState<string>("");
  const [openingFrom, setOpeningFrom] = useState<string>("");
  const [openingTo, setOpeningTo] = useState<string>("");
  const [nativePrice, setNativePrice] = useState<string>("");
  const [foreignPrice, setForeignPrice] = useState<string>("");
  const [studentPrice, setStudentPrice] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

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
    const formData = {
      category,
      name,
      date,
      description,
      picture,
      location,
      openingFrom,
      openingTo,
      nativePrice,
      foreignPrice,
      studentPrice,
      selectedTags,
      isActive,
    };
    console.log("Form submitted:", formData);
  };

  return (
    <div className="profile-form-container">
        <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Add Historical Place</h2>
        </Col>
      </Row>
      <Container className="mt-4">
        <Form onSubmit={handleFormSubmit}>
          <Row>
            <Col>
              <Form.Group className="form-group" controlId="category">
                <Form.Label>Category</Form.Label>
                <div className="custom-select-container">
                  <Form.Control
                    as="select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Historical Site">Historical Site</option>
                    <option value="Monument">Monument</option>
                    <option value="Museum">Museum</option>
                  </Form.Control>
                  <BiChevronDown className="dropdown-icon" />
                </div>
              </Form.Group >
            </Col>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Name"
                              type="text"
                              placeholder="Enter Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required id={""} disabled={false} name={""}              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Date"
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              required placeholder={""} id={""} disabled={false} name={""}              />
            </Col>
            <Col>
              <Form.Group  className="form-group" controlId="picture">
                <Form.Label>Picture</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPicture(e.target.files ? e.target.files[0] : null)
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Description"
                              type="textarea"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              required placeholder={""} id={""} disabled={false} name={""}              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Location"
                              type="text"
                              placeholder="Enter Location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              required id={""} disabled={false} name={""}              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Opening Hours (From)"
                              type="time"
                              value={openingFrom}
                              onChange={(e) => setOpeningFrom(e.target.value)}
                              required placeholder={""} id={""} disabled={false} name={""}              />
            </Col>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Opening Hours (To)"
                              type="time"
                              value={openingTo}
                              onChange={(e) => setOpeningTo(e.target.value)}
                              required placeholder={""} id={""} disabled={false} name={""}              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Native Price"
                              type="number"
                              placeholder="Enter Native Price"
                              value={nativePrice}
                              onChange={(e) => setNativePrice(e.target.value)}
                              required id={""} disabled={false} name={""}              />
            </Col>
            <Col>
              <AdminFormGroup className="form-group"
                              label="Foreign Price"
                              type="number"
                              placeholder="Enter Foreign Price"
                              value={foreignPrice}
                              onChange={(e) => setForeignPrice(e.target.value)}
                              required id={""} disabled={false} name={""}              />
            </Col>
            <Col> 
              <AdminFormGroup className="form-group"
                              label="Student Price"
                              type="number"
                              placeholder="Enter Student Price"
                              value={studentPrice}
                              onChange={(e) => setStudentPrice(e.target.value)}
                              required id={""} disabled={false} name={""}              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="form-group"  controlId="tags">
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
                        onClick={() => {
                          if (!selectedTags.includes(suggestion)) {
                            setSelectedTags((prev) => [...prev, suggestion]);
                          }
                          setInputValue("");
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
              <Form.Group controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" className="update-btn mt-4 mb-5 ">
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default HistoricalPlaceForm;
