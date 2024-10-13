import React, { useState, ChangeEvent, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../components/FormGroup/FormGroup"; // Reuse the form group component
import "../components/FormGroup.css"; // Reuse existing CSS
import "./CreateAdmin/CreateAdmin.css"; // Reuse the existing CSS
import "./tagsinput.css";
import tagsData from "./tags.json"; // Ensure this path is correct
import { BiChevronDown } from "react-icons/bi";
import { HistoricalService } from "../services/HistoricalService";
import { useAppSelector } from "../store/hooks";
import { useParams } from "react-router-dom";
import showToast from "../utils/showToast";
import { ToastTypes } from "../utils/toastTypes";

interface FormData {
  name: string;
  opening_days: string[];
  description: string;
  picture: string;
  location: string;
  openingFrom: string;
  openingTo: string;
  nativePrice: number;
  foreignPrice: number;
  studentPrice: number;
  isActive: boolean;
}

interface Tag {
  id: string;
  name: string;
  values: string[];
}

interface SelectedTag {
  id: string;
  value: string
}

const HistoricalPlaceForm: React.FC = () => {
  const { historical_location_id } = useParams();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);
  const [currentTags, setCurrentTags] = useState<Tag[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    opening_days: [],
    description: "",
    picture: "",
    location: "",
    openingFrom: "",
    openingTo: "",
    nativePrice: 0,
    foreignPrice: 0,
    studentPrice: 0,
    isActive: true,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          picture: reader.result as string,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add form submission logic here
    // console.log("Form submitted:", formData);
    try {
      // const updatedLocation = await HistoricalService.editHistoricalLocation(
      //   Governer.stakeholder_id,
      //   formData
      // );
      console.log(selectedTags)
      const tagsMap = selectedTags.reduce((acc, tag) => {
        acc[tag.id] = tag.value;
        return acc;
      }, {} as { [key: string]: string });
      console.log(tagsMap)
      // console.log("Historical Location updated successfully:", updatedLocation);
    } catch (error) {
      console.error("Failed to update Historical Location:", error);
    }
  };

  const getAllHistoricalTags = async () => {
    const tagsData = await HistoricalService.getAllHistorical_Tags();
    const mappedTags = tagsData.data.map((tag: any) => {
      return {
        id: tag._id,
        name: tag.name,
        values: tag.Values,
      };
    });
    setTags(mappedTags);
  }

  const getHistorical_Location = async () => {
    if (historical_location_id) {
      console.log("Wasal")
      let locationData = await HistoricalService.getHistoricalLocationByIdForGoverner(
        historical_location_id
      );
      locationData = locationData.data;
      setFormData({
        name: locationData.name,
        opening_days: locationData.opening_days,
        description: locationData.description,
        picture: locationData.picture,
        location: locationData.location.toString(),
        openingFrom: locationData.openingFrom,
        openingTo: locationData.openingTo,
        nativePrice: locationData.native_price,
        foreignPrice: locationData.foreign_price,
        studentPrice: locationData.student_price,
        isActive: locationData.isActive,
      })
      console.log(locationData)
    } else {
      console.error("Historical location ID is undefined");
    }
  }

  useEffect(() => {
    getAllHistoricalTags();
  }, []);

  useEffect(() => {
    getHistorical_Location();
  }, [historical_location_id]);

  const handleAddTag = () => {
    if(currentTags.length === tags.length) {
      showToast("All tags have been added", ToastTypes.ERROR);
      return;
    };
    setCurrentTags([...currentTags, tags[0]]);
  }

  const handleRemoveTag = (index: number) => {
    const newCurrentTags = currentTags.filter((_, i) => i !== index);
    const newSelectedTags = selectedTags.filter((_, i) => i !== index);
    setCurrentTags(newCurrentTags);
    setSelectedTags(newSelectedTags);
  };

  const Governer = useAppSelector((state) => state.user);

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4 w-100">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Edit Historical Location</h2>
        </Col>
      </Row>
      <Container className="mt-4">
        <Form onSubmit={handleFormSubmit}>
          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Name"
                type="text"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                id={"name"}
                disabled={false}
                name={"name"}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Opening Days"
                type="text"
                value={formData.opening_days.join(",")}
                onChange={handleInputChange}
                required
                placeholder={""}
                id={"opening_days"}
                disabled={false}
                name={"opening_days"}
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="picture">
                <Form.Label>Picture</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder={""}
                id={"description"}
                disabled={false}
                name={"description"}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Location"
                type="text"
                placeholder="Enter Location"
                value={formData.location}
                onChange={handleInputChange}
                required
                id={"location"}
                disabled={false}
                name={"location"}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Opening Hours (From)"
                type="time"
                value={formData.openingFrom}
                onChange={handleInputChange}
                required
                placeholder={""}
                id={"openingFrom"}
                disabled={false}
                name={"openingFrom"}
              />
            </Col>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Opening Hours (To)"
                type="time"
                value={formData.openingTo}
                onChange={handleInputChange}
                required
                placeholder={""}
                id={"openingTo"}
                disabled={false}
                name={"openingTo"}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Native Price"
                type="number"
                placeholder="Enter Native Price"
                value={String(formData.nativePrice)}
                onChange={handleInputChange}
                required
                id={"nativePrice"}
                disabled={false}
                name={"nativePrice"}
              />
            </Col>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Foreign Price"
                type="number"
                placeholder="Enter Foreign Price"
                value={String(formData.foreignPrice)}
                onChange={handleInputChange}
                required
                id={"foreignPrice"}
                disabled={false}
                name={"foreignPrice"}
              />
            </Col>
            <Col>
              <AdminFormGroup
                className="form-group"
                label="Student Price"
                type="number"
                placeholder="Enter Student Price"
                value={String(formData.studentPrice)}
                onChange={handleInputChange}
                required
                id={"studentPrice"}
                disabled={false}
                name={"studentPrice"}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="form-group" controlId="tags">
                <Form.Label>Tags</Form.Label>
                {currentTags.map((tag: Tag, index) => {
                  return (
                    <Row key={index} className="mt-1">
                      <Col>
                        <div className="custom-select-container">
                          <Form.Control
                            as="select"
                            value={selectedTags[index]?.id || ""}
                            onChange={(e) => {
                              const selectedKey = e.target.value;
                              const selectedValue = selectedTags[index]?.value || "";
                              const newSelectedTags = [...selectedTags];
                              newSelectedTags[index] = { id: selectedKey, value: selectedValue };
                              setSelectedTags(newSelectedTags);
                            }}
                            required
                          >
                            <option value="">Select Tag</option>
                            {tags
                            .filter((value) => !selectedTags.some(tag => tag.id === value.id) || value.id === selectedTags[index]?.id)
                            .map((value, index) => (
                              <option key={index} value={value.id}>
                                {value.name}
                              </option>
                            ))}
                          </Form.Control>
                          <BiChevronDown className="dropdown-icon" />
                        </div>
                      </Col>
                      <Col>
                        <div className="custom-select-container">
                          <Form.Control
                            as="select"
                            value={selectedTags[index]?.value || ""}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              const newSelectedTags = [...selectedTags];
                              newSelectedTags[index].value = selectedValue;
                              setSelectedTags(newSelectedTags);
                            }}
                            required
                          >
                            <option value="">Select Value</option>
                            {tags
                              .find((t) => t.id === selectedTags[index]?.id)
                              ?.values.map((value, index) => (
                                <option key={index} value={value}>
                                  {value}
                                </option>
                              ))}
                          </Form.Control>
                          <BiChevronDown className="dropdown-icon" />
                        </div>
                      </Col>
                      <Col xs="auto">
                        <Button
                          variant="danger"
                          onClick={() => handleRemoveTag(index)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  );
                })}
              </Form.Group>
            </Col>
            <Col>
              <Button
                className="mt-3"
                variant="main-inverse"
                onClick={handleAddTag}
              >
                Add Another Tag
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" className="update-btn mt-4 mb-5 ">
            Update
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default HistoricalPlaceForm;
