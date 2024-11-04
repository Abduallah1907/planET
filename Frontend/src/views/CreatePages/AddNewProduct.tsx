import React, { useState, ChangeEvent } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../../components/FormGroup/FormGroup"; // Reuse the form group component
import { useAppSelector } from "../../store/hooks";
import { ProductService } from "../../services/ProductService";
import { useNavigate } from "react-router-dom";
import { FileService } from "../../services/FileService";
import showToast from "../../utils/showToast";
import { ToastTypes } from "../../utils/toastTypes";

interface FormData {
  name: string;
  description: string;
  image: File | null;
  price: number;
  quantity: number;
  archive_flag: boolean;
}

const AddNewProduct: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image: null,
    price: 0,
    quantity: 0,
    archive_flag: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Check if the field is Price or Quantity
    if (name === "price" || name === "quantity") {
      const numericalValue = parseFloat(value); // Use parseFloat for Price

      // Validate for negative values
      if (numericalValue < 0) {
        showToast(`${name} cannot be negative`, ToastTypes.ERROR);
        setFormData({ ...formData, [name]: "0" }); // Reset to 0 if negative
        return;
      }
    }

    // Update formData based on the input type
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };
  const seller_id = useAppSelector((state) => state.user.stakeholder_id?._id);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      quantity: formData.quantity,
      archive_flag: formData.archive_flag,
    };
    if (formData.image && seller_id) {
      const file = await FileService.uploadFile(formData.image);
      await ProductService.createProduct(seller_id, {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image: file.data._id,
        quantity: formData.quantity,
        archive_flag: formData.archive_flag,
      });
      navigate("/MyProducts");
    }
    if (seller_id && !formData.image) {
      await ProductService.createProduct(seller_id, productData);
      navigate("/MyProducts");
    } else {
      console.error("Seller ID is undefined");
    }
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Add New Product</h2>
        </Col>
      </Row>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <AdminFormGroup
                label="Product Name"
                type="textarea"
                placeholder="Enter Product Name"
                id="name"
                disabled={false}
                required={true}
                value={formData.name}
                onChange={handleChange}
                name="name"
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Description"
                type="textarea"
                placeholder="Enter Product Description"
                id="description"
                disabled={false}
                required={true}
                value={formData.description}
                onChange={handleChange}
                name="description"
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>
                  <h3>Upload Product Image</h3>
                </Form.Label>
                <Form.Control
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Price"
                type="number"
                placeholder="Enter Product Price"
                id="price"
                disabled={false}
                required={true}
                value={formData.price.toString()}
                onChange={handleChange}
                name="price"
              />
            </Col>
            <Col>
              <AdminFormGroup
                label="Quantity"
                type="number"
                placeholder="Enter Product Quantity"
                id="quantity"
                disabled={false}
                required={true}
                value={formData.quantity.toString()}
                onChange={handleChange}
                name="quantity"
                // Ensure only integer values
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="is-archived">
                <Form.Check
                  type="checkbox"
                  label="Archived"
                  name="archive_flag"
                  checked={formData.archive_flag}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button
            variant="main-inverse"
            type="submit"
            className="mt-3"
            onClick={handleSubmit}
          >
            Add Product
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AddNewProduct;
