import CustomFormGroup from "../../components/FormGroup/FormGroup";
import MapModal from "../../components/MapModal";
import { ChangeEvent, useState } from "react";
import countryData from "../../utils/countryData.json";
import { Button, Form } from "react-bootstrap";
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";

interface FormData {
  street_name: string;
  apartment_number: string;
  city: string;
  country: string;
  postalCode: string;
  location: {
    lat: number;
    lng: number;
  };
}

const AddDeliveryAddress: React.FC = () => {
  const tourist = useAppSelector((state) => state.user);
  const [showMapModal, setShowMapModal] = useState(false); // State to manage modal visibility
  const [formData, setFormData] = useState<FormData>({
    street_name: "",
    apartment_number: "",
    city: "",
    country: "",
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
          (country) => country.country == formData.country
        )[0].city
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    const data = {
      street_name: formData.street_name,
      apartment_number: formData.apartment_number,
      city: formData.city,
      country: formData.country,
    };
    await TouristService.addAddress(tourist.email);
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
          value={formData.street_name}
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
          value={formData.apartment_number}
          onChange={handleChange}
        />
        <CustomFormGroup
          label={"City"}
          type={"text"}
          placeholder={"City Name"}
          options={cities}
          id={"cityName"}
          disabled={formData.country === ""}
          required={true}
          name={"cityName"}
          value={formData.city}
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
          value={formData.country}
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
