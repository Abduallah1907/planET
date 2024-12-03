import CustomFormGroup from "../../components/FormGroup/FormGroup";
import MapModal from "../../components/MapModal";
import { ChangeEvent, useState } from "react";
import countryData from "../../utils/countryData.json";
import { Button, Container, Form } from "react-bootstrap";
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";
import showToastMessage from "../../utils/showToastMessage";
import { ToastTypes } from "../../utils/toastTypes";

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "postalCode") {
      // Allow only positive numbers (including empty or zero values for flexibility)
      if (!/^\d*$/.test(value)) {
        showToastMessage("Postal code must be a positive number", ToastTypes.ERROR); // Show error message
        return;
      }
    }
  
    if (name === "country") {
      const selectedCountry = countryData.find((country) => country.country === value);
      setCities(selectedCountry ? selectedCountry.city : []); // Update cities for the selected country
      setFormData({ ...formData, country: value, city: "" }); // Reset city if country changes
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      street_name: formData.street_name,
      apartment_number: formData.apartment_number,
      city: formData.city,
      country: formData.country,
      postal_code: formData.postalCode,
    };
    await TouristService.addAddress(tourist.email, data);
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false); // Close the modal
  };

  return (
    <Container>
      <h2 className="my-profile-heading">Add Delivery Address</h2>
      <Form className="ms-5 mt-3 w-75">
        <CustomFormGroup
          label={"Street Name"}
          type={"text"}
          placeholder={"123 Street Name"}
          id={"street_name"}
          disabled={false}
          required={true}
          name={"street_name"}
          value={formData.street_name}
          onChange={handleChange}
        />
        <CustomFormGroup
          label={"Apartment Number"}
          type={"text"}
          placeholder={"123"}
          id={"apartment_number"}
          disabled={false}
          required={true}
          name={"apartment_number"}
          value={formData.apartment_number}
          onChange={handleChange}
        />
         <CustomFormGroup
          label={"Country"}
          type={"select"}
          placeholder={"Select a country"}
          options={countryData.map((country) => country.country)}
          id={"country"}
          disabled={false}
          required={true}
          name={"country"}
          value={formData.country}
          onChange={handleChange}
        />
        <CustomFormGroup
         label={"City"}
         type={"select"} 
         placeholder={"Select a city"}
         options={cities}
         id={"city"}
         disabled={!formData.country} 
         required={true}
         name={"city"}
         value={formData.city}
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

        <Button variant="main-inverse" className="mb-5" onClick={() => setShowMapModal(true)}>
          Set Location
        </Button>
        <Button type="submit" className="mb-5"  variant="main-inverse" onClick={handleSubmit}>
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
    </Container>
  );
};

export default AddDeliveryAddress;
