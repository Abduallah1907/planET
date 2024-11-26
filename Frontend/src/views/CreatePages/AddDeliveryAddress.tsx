import CustomFormGroup from "../../components/FormGroup/FormGroup";
import MapModal from "../../components/MapModal";
import { ChangeEvent, useState } from "react";
import countryData from "../../utils/countryData.json";
import { Button, Form } from "react-bootstrap";

interface FormData {
  streetName: string;
  apartmentNum: string;
  cityName: string;
  countryName: string;
  postalCode: string;
  location: {
    lat: number;
    lng: number;
  };
}

const AddDeliveryAddress: React.FC = () => {
  const [showMapModal, setShowMapModal] = useState(false); // State to manage modal visibility
  const [formData, setFormData] = useState<FormData>({
    streetName: "",
    apartmentNum: "",
    cityName: "",
    countryName: "",
    postalCode: "",
    location: {
      lat: 0,
      lng: 0,
    },
  });

  const [cities, setCities] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "countryName") {
      setCities(
        countryData.filter(
          (country) => country.country == formData.countryName
        )[0].city
      );
    }
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false); // Close the modal
  };

  return (
    <>
      <h1>Add Delivery Address</h1>
      <Form>
        <CustomFormGroup
          label={"Street Name"}
          type={"text"}
          placeholder={"123 Street Name"}
          id={"streetName"}
          disabled={false}
          required={true}
          name={"streetName"}
          value={formData.streetName}
          onChange={handleChange}
        />
        <CustomFormGroup
          label={"Apartment Number"}
          type={"text"}
          placeholder={"123"}
          id={"apartmentNum"}
          disabled={false}
          required={true}
          name={"apartmentNum"}
          value={formData.apartmentNum}
          onChange={handleChange}
        />
        <CustomFormGroup
          label={"City"}
          type={"text"}
          placeholder={"City Name"}
          options={cities}
          id={"cityName"}
          disabled={formData.countryName === ""}
          required={true}
          name={"cityName"}
          value={formData.cityName}
          onChange={handleChange}
        />
        <CustomFormGroup
          label={"Country"}
          type={"select"}
          placeholder={"Country Name"}
          options={countryData.map((country) => country.country)}
          id={"countryName"}
          disabled={false}
          required={true}
          name={"countryName"}
          value={formData.countryName}
          onChange={handleChange}
        />
        <CustomFormGroup
          label={"Postal Code"}
          type={"number"}
          placeholder={"12345"}
          id={"postalCode"}
          disabled={false}
          required={true}
          name={"postalCode"}
          value={formData.postalCode}
          onChange={handleChange}
        />

        <Button variant="main-inverse" onClick={() => setShowMapModal(true)}>
          Set Location
        </Button>
        <Button type="submit" variant="main-inverse">
          Submit
        </Button>
      </Form>

      <MapModal
        open={showMapModal}
        handleClose={handleCloseMapModal}
        center={formData.location}
        onMapClick={(e) => {
          if (e.detail.latLng) {
            setFormData({
              ...formData,
              location: {
                lat: e.detail.latLng.lat,
                lng: e.detail.latLng.lng,
              },
            });
          }
        }}
      />
    </>
  );
};

export default AddDeliveryAddress;
