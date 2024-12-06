import React, { useState, ChangeEvent } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import AdminFormGroup from "../../components/FormGroup/FormGroup"; // Reuse the form group component
import { useAppSelector } from "../../store/hooks";
import { ProductService } from "../../services/ProductService";
import { useNavigate } from "react-router-dom";
import { FileService } from "../../services/FileService";
import showToastMessage from "../../utils/showToastMessage";
import { ToastTypes } from "../../utils/toastTypes";

interface FormData {
  name: string;
  description: string;
  image: File | null;
  price: number;
  quantity: number;
  archive_flag: boolean;
}

interface AddNewProductModalProps {
  show: boolean;
  onHide: () => void;
}

const AddNewProduct: React.FC<AddNewProductModalProps> = ({ show, onHide }) => {
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

    // Validate numeric fields for negative values
    if ((name === "price" || name === "quantity") && parseFloat(value) < 0) {
      showToastMessage(`${name} cannot be negative`, ToastTypes.ERROR);
      setFormData({ ...formData, [name]: 0 });
      return;
    }

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

    try {
      if (formData.image && seller_id) {
        const file = await FileService.uploadFile(formData.image);
        await ProductService.createProduct(seller_id, {
          ...productData,
          image: file.data._id,
        });
        showToastMessage("Product added successfully", ToastTypes.SUCCESS);
      } else if (seller_id) {
        await ProductService.createProduct(seller_id, productData);
        showToastMessage("Product added successfully", ToastTypes.SUCCESS);
      } else {
        console.error("Seller ID is undefined");
      }
      onHide(); // Close modal upon success
      navigate("/MyProducts");
    } catch (error) {
      showToastMessage("Failed to add product", ToastTypes.ERROR);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      image: null,
      price: 0,
      quantity: 0,
      archive_flag: false,
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
                <AdminFormGroup
                  label="Upload Product Image"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  id="formFile"
                  name="logo"
                  placeholder={""}
                  disabled={false}
                />
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
            <Button variant="main-inverse" type="submit" className="mt-3">
              Add Product
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="mt-3 ms-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewProduct;
