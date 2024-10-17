import React, { useState, ChangeEvent, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../../components/FormGroup/FormGroup"; // Reuse the form group component
import "../tagsinput.css";
import { BiChevronDown } from "react-icons/bi";
import { HistoricalService } from "../../services/HistoricalService";
import { useNavigate, useParams } from "react-router-dom";
import showToast from "../../utils/showToast";
import { ToastTypes } from "../../utils/toastTypes";
import DaysModal from "../../components/DaysModals";

interface FormData {
  name: string;
  description: string;
  picture: string;
  location: string;
  openingDays: string[];
  openingFrom: string;
  openingTo: string;
  nativePrice: number;
  foreignPrice: number;
  studentPrice: number;
  active_flag: boolean;
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
  const [showDaysModal, setShowDaysModal] = useState(false); // State to manage modal visibility
  const [selectedDays, setSelectedDays] = useState<string[]>([]); // State to manage selected days

  const [formData, setFormData] = useState<FormData>({
    name: "",
    openingDays: [],
    description: "",
    picture: "",
    location: "",
    openingFrom: "",
    openingTo: "",
    nativePrice: 0,
    foreignPrice: 0,
    studentPrice: 0,
    active_flag: true,
  });

  const navigate = useNavigate()

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
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add form submission logic here
    try {
      const tagsMap = selectedTags.reduce((acc, tag) => {
        acc[tag.id] = tag.value;
        return acc;
      }, {} as { [key: string]: string });
      const reqData = {
        name: formData.name,
        description: formData.description,
        // picture: formData.picture,
        // location: formData.location,
        opening_days: formData.openingDays,
        opening_hours_from: formData.openingFrom,
        opening_hours_to: formData.openingTo,
        native_price: formData.nativePrice,
        foreign_price: formData.foreignPrice,
        student_price: formData.studentPrice,
        tags: tagsMap,
        active_flag: formData.active_flag,
      }
      if (historical_location_id) {
        await HistoricalService.editHistoricalLocation(
          historical_location_id,
          reqData
        );
        navigate('/MyHistoricalLocations')
      } else {
        console.error("Historical location ID is undefined");
      }
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
        values: tag.values,
      };
    });
    setTags(mappedTags);
  }

  const getHistorical_Location = async () => {
    if (historical_location_id) {
      let locationData = await HistoricalService.getHistoricalLocationByIdForGoverner(
        historical_location_id
      );
      locationData = locationData.data;
      setFormData({
        name: locationData.name,
        openingDays: locationData.opening_days,
        description: locationData.description,
        picture: locationData.picture,
        location: locationData.location.toString(),
        openingFrom: locationData.opening_hours_from,
        openingTo: locationData.opening_hours_to,
        nativePrice: locationData.native_price,
        foreignPrice: locationData.foreign_price,
        studentPrice: locationData.student_price,
        active_flag: locationData.active_flag,
      })
      setSelectedTags(Object.entries(locationData.tags).map(([key, value]) => ({ id: key, value: value as string })));
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
    if(selectedTags.length === tags.length) {
      showToast("All tags have been added", ToastTypes.ERROR);
      return;
    };
    setSelectedTags([...selectedTags, { id: "", value: "" }]);
  }

  const handleRemoveTag = (index: number) => {
    const newSelectedTags = selectedTags.filter((_, i) => i !== index);
    setSelectedTags(newSelectedTags);
  };

  const handleDaysInputClick = () => {
    setShowDaysModal(true);
  };

  const handleDaysModalClose = () => {
    setShowDaysModal(false);
    setFormData({ ...formData, openingDays: selectedDays });
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4 w-100">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Edit Historical Location</h2>
        </Col>
      </Row>
      <Container className="mt-4">
        <Form onSubmit={handleSubmit}>
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
                value={formData.openingDays.join(",")}
                onChange={handleDaysInputClick}
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
                  className="custom-form-control"
                  onChange={handleFileChange}
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
                {selectedTags.map((tag: SelectedTag, index) => {
                  return (
                    <Row key={index} className="mt-1">
                      <Col>
                        <div className="custom-select-container">
                          <Form.Control
                            as="select"
                            value={tag.id || ""}
                            className="custom-form-control"
                            onChange={(e) => {
                              const selectedKey = e.target.value;
                              const selectedValue = tag.value || "";
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
                            value={tag.value || ""}
                            className="custom-form-control"
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
                              .find((t) => t.id === tag.id)
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
              <Form.Group controlId="active_flag">
                <Form.Check
                  id="active_flag"
                  type="checkbox"
                  label="Active"
                  name="active_flag"
                  checked={formData.active_flag}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" variant="main-inverse" className="mt-4 mb-5 ">
            Update
          </Button>
        </Form>
      </Container>
      <DaysModal
        show={showDaysModal}
        handleClose={handleDaysModalClose}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
      />
    </div>
  );
};

export default HistoricalPlaceForm;