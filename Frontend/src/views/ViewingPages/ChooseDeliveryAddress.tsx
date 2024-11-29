import CustomFormGroup from "../../components/FormGroup/FormGroup";
import { Button, Container, Form } from "react-bootstrap";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { TouristService } from "../../services/TouristService";

interface FormData {
  DeliveryAddress: string;
}

interface DeliveryAddress {
  _id: string;
  street_name: string;
  apartment_number: string;
  city: string;
  country: string;
  postal_code: number;
}

const ChooseDeliveryAddress: React.FC = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [formData, setFormData] = useState<FormData>({
    DeliveryAddress: "",
  });

  const user = useAppSelector((state) => state.user);

  const getAddresses = async () => {
    const response = await TouristService.getAddresses(user.email);
    setAddresses(response.data);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, DeliveryAddress: event.target.value });
  };

  useEffect(() => {
    getAddresses();
  }, []);

  return (
    <Container>
      <h1>Choose Delivery Address</h1>
      <Form>
        <CustomFormGroup
          label={"Delivery Address"}
          type={"select"}
          placeholder={"Address"}
          id={"deliveryAddress"}
          disabled={false}
          required={true}
          name={"deliveryAddress"}
          value={formData.DeliveryAddress}
          onChange={handleChange}
          optionsSplit={addresses.map((deliveryAddress) => {
            return {
              label:
                deliveryAddress.apartment_number +
                ", " +
                deliveryAddress.street_name +
                ", " +
                deliveryAddress.city +
                ", " +
                deliveryAddress.country,
              value: deliveryAddress._id,
            };
          })}
        />

        <Button
          type="submit"
          variant="main-inverse"
          onClick={() => navigate("/ProductPayment")}
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
};
export default ChooseDeliveryAddress;
