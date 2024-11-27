import CustomFormGroup from "../../components/FormGroup/FormGroup";
import { Button, Form } from "react-bootstrap"
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
    DeliveryAddress: string;
    
  }
const ChooseDeliveryAddress: React.FC=()=>{
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        DeliveryAddress: "",
        
      });
      const addressOptions = [
        "123 Main Street, City A",
        "456 Elm Street, City B",
        "789 Oak Street, City C",
      ];
    
      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, DeliveryAddress: event.target.value });
      };
      return (
        <>
          <h1>Choose Delivery Address</h1>
          <Form>
            <CustomFormGroup
              label={"Delivery Address"}
              type={"text"}
              placeholder={"Address"}
              id={"deliveryAddress"}
              disabled={false}
              required={true}
              name={"streetName"}
              value={formData.DeliveryAddress}
              onChange={handleChange}
              options={addressOptions}
            />
    
            <Button type="submit" variant="main-inverse" onClick={() => navigate("/ProductPayment")} >
              Submit
            </Button>
          </Form>
    
        </>
      );

}
export default ChooseDeliveryAddress;