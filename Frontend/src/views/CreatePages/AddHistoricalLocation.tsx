import React, { useState, ChangeEvent, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../../components/FormGroup/FormGroup"; // Reuse the form group component
import { BiChevronDown } from "react-icons/bi";
import { HistoricalService } from "../../services/HistoricalService";
import DaysModal from "../../components/DaysModals";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { ToastTypes } from "../../utils/toastTypes";
import showToastMessage from "../../utils/showToastMessage";
import { FileService } from "../../services/FileService";
import MapModal from "../../components/MapModal";
import { MapMouseEvent } from "@vis.gl/react-google-maps";
import { reverseGeoCode } from "../../utils/geoCoder";

interface FormData {
  name: string;
  description: string;
  images: File[] | null;
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
  value: string;
}

const HistoricalPlaceForm: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);
  const [showDaysModal, setShowDaysModal] = useState(false); // State to manage modal visibility
  const [selectedDays, setSelectedDays] = useState<string[]>([]); // State to manage selected days

  const [formData, setFormData] = useState<FormData>({
    name: "",
    openingDays: [],
    description: "",
    images: [],
    openingFrom: "",
    openingTo: "",
    nativePrice: 0,
    foreignPrice: 0,
    studentPrice: 0,
    active_flag: true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Check if the input is for a price field
    if (
      name === "nativePrice" ||
      name === "foreignPrice" ||
      name === "studentPrice"
    ) {
      const numericValue = parseFloat(value);
      if (numericValue < 0) {
        showToastMessage("Price cannot be negative", ToastTypes.ERROR); //Show toast message not API
        setFormData({ ...formData, [name]: 0 });
        // Ignore negative values, you might also want to show a warning here
        return;
      }
    }

    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const Governer = useAppSelector((state) => state.user);
  const [showMapModal, setShowMapModal] = useState(false); // State to manage modal visibility
  const [center, setCenter] = React.useState({
    lat: 29.98732507495249,
    lng: 31.435660077332482,
    address: "",
  });

  const navigate = useNavigate();

  const handleOpenMapModal = () => {
    setShowMapModal(true); // Show the modal
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false); // Close the modal
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tagsMap = selectedTags.reduce((acc, tag) => {
      acc[tag.id] = tag.value;
      return acc;
    }, {} as { [key: string]: string });
    const firstImageId = formData.images && formData.images.length > 0
    ? (await FileService.uploadFile(formData.images[0])).data._id
    : null;

    const reqData = {
      name: formData.name,
      location: { latitude: center.lat, longitude: center.lng },
      images: firstImageId ? [firstImageId] : [],
      description: formData.description,
      opening_days: formData.openingDays,
      opening_hours_from: formData.openingFrom,
      opening_hours_to: formData.openingTo,
      native_price: formData.nativePrice,
      foreign_price: formData.foreignPrice,
      student_price: formData.studentPrice,
      tags: tagsMap,
      governor_id: Governer.stakeholder_id._id,
      active_flag: formData.active_flag,
    };

    await HistoricalService.addHistoricalLocation(reqData);

    navigate("/MyHistoricalLocations");
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
  };

  useEffect(() => {
    getAllHistoricalTags();
  }, []);

  const handleAddTag = () => {
    if (selectedTags.length === tags.length) {
      showToastMessage("All tags have been added", ToastTypes.ERROR); //Show toast message not API
      return;
    }
    setSelectedTags([...selectedTags, { id: "", value: "" }]);
  };

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
          <h2 className="my-profile-heading">Add Historical Location</h2>
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
                onClick={handleDaysInputClick}
                required
                placeholder={""}
                id={"opening_days"}
                disabled={false}
                name={"opening_days"}
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="images">
                <Form.Label>Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
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
                value={center.address}
                onChange={handleOpenMapModal}
                onClick={handleOpenMapModal}
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
                              newSelectedTags[index] = {
                                id: selectedKey,
                                value: selectedValue,
                              };
                              setSelectedTags(newSelectedTags);
                            }}
                            required
                          >
                            <option value="">Select Tag</option>
                            {tags
                              .filter(
                                (value) =>
                                  !selectedTags.some(
                                    (tag) => tag.id === value.id
                                  ) || value.id === selectedTags[index]?.id
                              )
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
            Create
          </Button>
        </Form>
      </Container>
      <MapModal
        open={showMapModal}
        handleClose={handleCloseMapModal}
        center={center}
        onMapClick={async (e: MapMouseEvent) => {
          if (e.detail.latLng) {
            const address = await reverseGeoCode(e.detail.latLng.lat, e.detail.latLng.lng);
            if (address && Array.isArray(address) && address[0]) {
              const location = {
                lat: e.detail.latLng.lat,
                lng: e.detail.latLng.lng,
                address: address[0].formatted_address,
              };
              setCenter(location);
            }
          }
        }
        }
      />
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
