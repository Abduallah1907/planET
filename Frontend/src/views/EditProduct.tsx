import React, { useState, ChangeEvent } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../components/FormGroup/FormGroup"; // Reuse the form group component
import "../components/FormGroup.css"; // Reuse existing CSS
import "./CreateAdmin/CreateAdmin.css"; // Reuse the existing CSS

const AddNewProduct: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPicture, setProductPicture] = useState<File | null>(null);
  const [productPrice, setProductPrice] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<string>("");
  const [isArchived, setIsArchived] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setIsArchived(checked);
    } else {
      switch (name) {
        case "productName":
          setProductName(value);
          break;
        case "productDescription":
          setProductDescription(value);
          break;
        case "productPrice":
          setProductPrice(value);
          break;
        case "productQuantity":
          if (/^\d*$/.test(value)) {
            // Ensure only integer values
            setProductQuantity(value);
          }
          break;
        default:
          break;
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductPicture(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDescription);
    if (productPicture) formData.append("picture", productPicture);
    formData.append("price", productPrice);
    formData.append("quantity", productQuantity);
    formData.append("isArchived", isArchived.toString());

    // console.log("Product data submitted", formData);

    setProductName("");
    setProductDescription("");
    setProductPicture(null);
    setProductPrice("");
    setProductQuantity("");
    setIsArchived(false);
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Edit Product</h2>
        </Col>
      </Row>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <AdminFormGroup
                label="Product Name"
                type="text"
                placeholder="Enter Product Name"
                id="product-name"
                disabled={false}
                required={true}
                value={productName}
                onChange={handleInputChange}
                name="productName"
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Description"
                type="textarea"
                placeholder="Enter Product Description"
                id="product-description"
                disabled={false}
                required={true}
                value={productDescription}
                onChange={handleInputChange}
                name="productDescription"
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="form-group" controlId="product-picture">
                <Form.Label>Picture</Form.Label>
                <Form.Control
                  type="file"
                  name="productPicture"
                  accept="image/*"
                  onChange={handleFileChange}
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
                id="product-price"
                disabled={false}
                required={true}
                value={productPrice}
                onChange={handleInputChange}
                name="productPrice"
              />
            </Col>
            <Col>
              <AdminFormGroup
                label="Quantity"
                type="number"
                placeholder="Enter Product Quantity"
                id="product-quantity"
                disabled={false}
                required={true}
                value={productQuantity}
                onChange={handleInputChange}
                name="productQuantity"
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
                  name="isArchived"
                  checked={isArchived}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" className="update-btn mt-3">
            Update Product
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AddNewProduct;
